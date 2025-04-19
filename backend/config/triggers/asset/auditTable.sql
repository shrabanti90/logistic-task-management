
CREATE EXTENSION IF NOT EXISTS hstore;

CREATE SCHEMA audit;
REVOKE ALL ON SCHEMA audit FROM public;

COMMENT ON SCHEMA audit IS 'Out-of-table audit/history logging tables and trigger functions';

CREATE TABLE audit.Logs (
    id bigserial primary key,
    schemaName text not null,
    tableName text not null,
    relationOid oid not null,
    sessionUserName text,
    transactionStartTimestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    statementStartTimestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    eventActionTimeStamp TIMESTAMP WITH TIME ZONE NOT NULL,
    transactionId bigint,
    applicationName text,
    clientAddress inet,
    clientPort integer,
    clientQuery text,
    action TEXT NOT NULL CHECK (action IN ('INSERT','DELETE','UPDATE', 'TRUNCATE')),
    oldValues hstore,
    updatedValues hstore,
    statementOnly boolean not null
);

REVOKE ALL ON audit.Logs FROM public;

COMMENT ON TABLE audit.Logs IS 'History of auditable actions on audited tables, from audit.generateAuditLogFunction()';
COMMENT ON COLUMN audit.Logs.id IS 'Unique identifier for each auditable event';
COMMENT ON COLUMN audit.Logs.schemaName IS 'Database schema audited table for this event is in';
COMMENT ON COLUMN audit.Logs.tableName IS 'Non-schema-qualified table name of table event occured in';
COMMENT ON COLUMN audit.Logs.relationOid IS 'Table OID. Changes with drop/create. Get with ''tablename''::regclass';
COMMENT ON COLUMN audit.Logs.sessionUserName IS 'Login / session user whose statement caused the audited event';
COMMENT ON COLUMN audit.Logs.transactionStartTimestamp IS 'Transaction start timestamp for tx in which audited event occurred';
COMMENT ON COLUMN audit.Logs.statementStartTimestamp IS 'Statement start timestamp for tx in which audited event occurred';
COMMENT ON COLUMN audit.Logs.eventActionTimeStamp IS 'Wall clock time at which audited event''s trigger call occurred';
COMMENT ON COLUMN audit.Logs.transactionId IS 'Identifier of transaction that made the change. May wrap, but unique paired with transactionStartTimestamp.';
COMMENT ON COLUMN audit.Logs.clientAddress IS 'IP address of client that issued query. Null for unix domain socket.';
COMMENT ON COLUMN audit.Logs.clientPort IS 'Remote peer IP port address of client that issued query. Undefined for unix socket.';
COMMENT ON COLUMN audit.Logs.clientQuery IS 'Top-level query that caused this auditable event. May be more than one statement.';
COMMENT ON COLUMN audit.Logs.applicationName IS 'Application name set when this audit event occurred. Can be changed in-session by client.';
COMMENT ON COLUMN audit.Logs.action IS 'Action type; INSERT = insert, DELETE = delete, UPDATE = update, TRUNCATE = truncate';
COMMENT ON COLUMN audit.Logs.oldValues IS 'Record value. Null for statement-level trigger. For INSERT this is the new tuple. For DELETE and UPDATE it is the old tuple.';
COMMENT ON COLUMN audit.Logs.updatedValues IS 'New values of fields changed by UPDATE. Null except for row-level UPDATE events.';
COMMENT ON COLUMN audit.Logs.statementOnly IS '''t'' if audit event is from an FOR EACH STATEMENT trigger, ''f'' for FOR EACH ROW';

CREATE INDEX logs_relid_idx ON audit.Logs(relationOid);
CREATE INDEX logs_action_tstamp_tx_stm_idx ON audit.Logs(statementStartTimestamp);
CREATE INDEX logs_action_idx ON audit.Logs(action);

CREATE OR REPLACE FUNCTION audit.generateAuditLogFunction() RETURNS TRIGGER AS $body$
DECLARE
    audit_row audit.Logs;
    include_values boolean;
    log_diffs boolean;
    h_old hstore;
    h_new hstore;
    excluded_cols text[] = ARRAY[]::text[];
BEGIN
    IF TG_WHEN <> 'AFTER' THEN
        RAISE EXCEPTION 'audit.generateAuditLogFunction() may only run as an AFTER trigger';
    END IF;

    audit_row = ROW(
        nextval('audit.logs_id_seq'), -- id
        TG_TABLE_SCHEMA::text,                        -- schemaName
        TG_TABLE_NAME::text,                          -- tableName
        TG_RELID,                                     -- relation OID for much quicker searches
        session_user::text,                           -- sessionUserName
        current_timestamp,                            -- transactionStartTimestamp
        statement_timestamp(),                        -- statementStartTimestamp
        clock_timestamp(),                            -- eventActionTimeStamp
        txid_current(),                               -- transaction ID
        current_setting('application_name'),          -- client application
        inet_client_addr(),                           -- clientAddress
        inet_client_port(),                           -- clientPort
        current_query(),                              -- top-level query or queries (if multistatement) from client
        TG_OP,                                          -- action
        NULL, NULL,                                   -- oldValues, updatedValues
        'f'                                           -- statementOnly
        );

    IF NOT TG_ARGV[0]::boolean IS DISTINCT FROM 'f'::boolean THEN
        audit_row.clientQuery = NULL;
    END IF;

    IF TG_ARGV[1] IS NOT NULL THEN
        excluded_cols = TG_ARGV[1]::text[];
    END IF;
    
    IF (TG_OP = 'UPDATE' AND TG_LEVEL = 'ROW') THEN
        audit_row.oldValues = hstore(OLD.*) - excluded_cols;
        audit_row.updatedValues =  (hstore(NEW.*) - audit_row.oldValues) - excluded_cols;
        IF audit_row.updatedValues = hstore('') THEN
            -- All changed fields are ignored. Skip this update.
            RETURN NULL;
        END IF;
    ELSIF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN
        audit_row.oldValues = hstore(OLD.*) - excluded_cols;
    ELSIF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
        audit_row.oldValues = hstore(NEW.*) - excluded_cols;
    ELSIF (TG_LEVEL = 'STATEMENT' AND TG_OP IN ('INSERT','UPDATE','DELETE','TRUNCATE')) THEN
        audit_row.statementOnly = 't';
    ELSE
        RAISE EXCEPTION '[audit.generateAuditLogFunction] - Trigger func added as trigger for unhandled case: %, %',TG_OP, TG_LEVEL;
        RETURN NULL;
    END IF;
    INSERT INTO audit.Logs VALUES (audit_row.*);
    RETURN NULL;
END;
$body$
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public;



CREATE OR REPLACE FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) RETURNS void AS $body$
DECLARE
  stm_targets text = 'INSERT OR UPDATE OR DELETE OR TRUNCATE';
  _q_txt text;
  _ignored_cols_snip text = '';
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_table;
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_table;

    IF audit_rows THEN
        IF array_length(ignored_cols,1) > 0 THEN
            _ignored_cols_snip = ', ' || quote_literal(ignored_cols);
        END IF;
        _q_txt = 'CREATE TRIGGER audit_trigger_row AFTER INSERT OR UPDATE OR DELETE ON ' || 
                 target_table || 
                 ' FOR EACH ROW EXECUTE PROCEDURE audit.generateAuditLogFunction(' ||
                 quote_literal(audit_query_text) || _ignored_cols_snip || ');';
        RAISE NOTICE '%',_q_txt;
        EXECUTE _q_txt;
        stm_targets = 'TRUNCATE';
    ELSE
    END IF;

    _q_txt = 'CREATE TRIGGER audit_trigger_stm AFTER ' || stm_targets || ' ON ' ||
             target_table ||
             ' FOR EACH STATEMENT EXECUTE PROCEDURE audit.generateAuditLogFunction('||
             quote_literal(audit_query_text) || ');';
    RAISE NOTICE '%',_q_txt;
    EXECUTE _q_txt;

END;
$body$
language 'plpgsql';

COMMENT ON FUNCTION audit.audit_table(regclass, boolean, boolean, text[]) IS $body$
Add auditing support to a table.

Arguments:
   target_table:     Table name, schema qualified if not on search_path
   audit_rows:       Record each row change, or only audit at a statement level
   audit_query_text: Record the text of the client query that triggered the audit event?
   ignored_cols:     Columns to exclude from update diffs, ignore updates that change only ignored cols.
$body$;

CREATE OR REPLACE FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean) RETURNS void AS $body$
SELECT audit.audit_table($1, $2, $3, ARRAY[]::text[]);
$body$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION audit.audit_table(target_table regclass) RETURNS void AS $body$
SELECT audit.audit_table($1, BOOLEAN 't', BOOLEAN 't');
$body$ LANGUAGE 'sql';

COMMENT ON FUNCTION audit.audit_table(regclass) IS $body$
Add auditing support to the given table. Row-level changes will be logged with full client query text. No cols are ignored.
$body$;

CREATE OR REPLACE VIEW audit.tableslist AS 
 SELECT DISTINCT triggers.trigger_schema AS schema,
    triggers.event_object_table AS auditedtable
   FROM information_schema.triggers
    WHERE triggers.trigger_name::text IN ('audit_trigger_row'::text, 'audit_trigger_stm'::text)  
ORDER BY schema, auditedtable;

COMMENT ON VIEW audit.tableslist IS $body$
View showing all tables with auditing set up. Ordered by schema, then table.
$body$;