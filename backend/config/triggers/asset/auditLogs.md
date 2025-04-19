# Setup audit logs in database

 After running the SQL script which provides the template to generate triggers that will run when an event occurs i.e **INSERT**, **UPDATE**,  **DELETE**, and **TRUNCATE** on table.

## Generate triggers for tables

    CREATE TRIGGER <TableName>_audit_inser_update_delete 
    AFTER INSERT OR UPDATE OR DELETE ON "Faq" OR EACH ROW 
    EXECUTE PROCEDURE audit.generateAuditLogFunction();

 ## To check triggers information
 To check information about triggers generated

    SELECT  * FROM information_schema.triggers;

##  To retrieves information from log table
Below query will retrieves information rows from Logs table.

    SELECT tableName, action, sessionUserName, eventActionTimeStamp, oldValues, updatedValues 
    FROM audit.Logs;
