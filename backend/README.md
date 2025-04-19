# Protostaff User Backend Service

<!-- ![Protostaff](./public/images/logo.png) -->


This project contains entire User/Admin APIs such as authentication, authorization, profile etc.

---
## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environment.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v16.14.0

    $ npm --version
    8.3.1

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


## Getting Started

    $ git clone [GIT_PATH]
    $ cd PROJECT_TITLE
    $ npm install

# Audit log setup

## Setup audit logs in database

First need to run migration script, which will add createdBy and updatedBy columns in all the tables

Goto root level of the project, and execute below command to execute the migration script.

    npx sequelize-cli db:migrate

## Steps to execute script, that will create triggers on all the tables.

Goto /config/triggers/ directory, execute below command

    node triggers.js

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

## Configure app

Create .env file and add relevant key and values as shared separately along with code

## Running the project

    $ npm start


## API Document endpoints

  - swagger-ui-mobile  Endpoint : http://localhost:3000/api-docs/v1/mobile 

  - swagger-ui-web  Endpoint : http://localhost:3000/api-docs/v1/web 
