flowsim
=======
     
  Visualization of OpenFlow Data-plane Abstractions


DEPENDENCIES
============

  Please see the dependencies file for information on establishing your
  development environment.

SETUP
=====

  1) Setup the database

    a. Login to the postgres user
      
      > sudo su - postgres
    
    b. Create the database and user

      > psql
      
      Create the database

        CREATE DATABASE <database name>;

      where
        <database name> = flowsim

      Create the database user

        CREATE USER <username> PASSWORD '<password>';

      where
        <username> = flogdev
        <password> = flogdev
      
      Quit psql

        \q

    c. Modify the database server authorization file

      > <editor> /etc/postgresql/9.3/main/pg_hba.conf

      Add the following line

        host <database name> <node username> 127.0.0.1/32 password

      where
        <database name> = flowsim
        <node username> = flogdev

      Quit psql

        \q

    d. Restart the database server

      > pg_ctlcluster 9.3 main restart

    e. Log back into dev user

      > su - dev

  3) Source the environment

    > source flowsim/environment

  4) Run the migrations

    > flyway migrate

  5) Set up the mailer config file

    Remaining in the base 'flowsim/' directory, run the following command:

    > echo "module.exports = { service: 'gmail', auth: { user: '<your email>', pass: '<your password>' } }" > src/backend/mailer/config.js

    replacing <your email> with a valid gmail account and <your password>
    with the password for that account

  6) Go to DEPS.md and follow the instructions under "Local Dependencies"
  
RUNNING
=======

  1) Start the server
    > node server.js&

  2) Run the unit tests
    > npm test

  2) Generate documentation from the code base
    > yuidoc .

NOTES
=====

  Pleaes see the notes/ directory for a set of notes on the various technologies
  used in this project.

