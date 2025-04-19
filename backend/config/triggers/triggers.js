const fs = require('fs');
const chalk = require('chalk');
const { exit } = require('process');
const dotenv = require('dotenv');
const { log } = console;
dotenv.load({ path: '../../.env' });

const { sequelize } = require('../../models/index');

const dumpLogTrigger = async (transaction) => {
  log(chalk.yellow('Function starting dumpLogTrigger.'));
  try {
    const strCheckTriggerTemplateFileExecuted = `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_schema = 'audit'
      AND    table_name   = 'logs'
      );`;

    const [_TriggerTemplateFileExecuted, dbDataTriggerTemplateFileExecuted] =
      await sequelize.query(`${strCheckTriggerTemplateFileExecuted}`, {
        transaction,
      });

    const { rows: resultTriggerTemplateFileExecuted } =
      dbDataTriggerTemplateFileExecuted;

    if (
      resultTriggerTemplateFileExecuted.length > 0 &&
      resultTriggerTemplateFileExecuted[0].exists
    ) {
      log(chalk.green('Trigger template function is already present.'));
    } else {
      const data = fs.readFileSync('./asset/auditTable.sql', {
        encoding: 'utf8',
        flag: 'r',
      });

      const [_, dbData] = await sequelize.query(`${data}`, { transaction });
      log(chalk.green('Trigger template function created successfully.'));
    }
  } catch (e) {
    log(chalk.red('Error occurred while creating trigger template function.'));
    log(chalk.red('Error in dumpLogTrigger :: ', e));
    throw e;
  }
};

const createTriggersOnTables = async (transaction) => {
  try {
    const strGetTableList = `SELECT * FROM pg_catalog.pg_tables where schemaname = 'public'`;
    const [_, dbData] = await sequelize.query(`${strGetTableList}`);
    log(chalk.yellow(JSON.stringify(dbData)));

    for (let intI = 0; intI < dbData.rows.length; intI++) {
      const objCurrentObject = dbData.rows[intI];
      const { tablename } = objCurrentObject;

      const strTriggerName =
        `${tablename}_audit_insert_update_delete`.toLowerCase();

      const strTriggerExistsQuery = `select * from information_schema.triggers where trigger_name = '${strTriggerName}'`;

      const [_TriggerExists, dbDataTriggerExists] = await sequelize.query(
        `${strTriggerExistsQuery}`
      );

      const { rows: resultTriggerTemplateFileExecuted } = dbDataTriggerExists;

      if (resultTriggerTemplateFileExecuted.length > 0) {
        log(
          chalk.green(
            `Trigger with name ${strTriggerName}, already exists in the system.`
          )
        );
      } else {
        const strCreateTriggerStatement = `CREATE TRIGGER ${tablename}_audit_insert_update_delete
            AFTER INSERT OR UPDATE OR DELETE ON "${tablename}" FOR EACH ROW
            EXECUTE PROCEDURE audit.generateAuditLogFunction()`;

        const [_CreateTrigger, dbDataCreateTrigger] = await sequelize.query(
          `${strCreateTriggerStatement}`,
          { transaction }
        );
        log(chalk.green(`Trigger with name ${strTriggerName} created.`));
      }
    }
  } catch (e) {
    log(chalk.red('Error occurred while creating triggers for tables.'));
    log(chalk.red('Error in createTriggersOnTables :: ', e));
    throw e;
  }
};

const startScript = async () => {
  const transaction = await sequelize.transaction();
  try {
    await dumpLogTrigger(transaction);
    log(chalk.yellow('dumpLogTrigger Finished'));

    await createTriggersOnTables(transaction);
    log(chalk.yellow('createTriggersOnTables Finished'));

    log(chalk.yellow('Database transaction commit'));
    await transaction.commit();
    exit();
  } catch (e) {
    log(chalk.red('Database transaction rollback', e));
    await transaction.rollback();
    exit();
  }
};

startScript();
