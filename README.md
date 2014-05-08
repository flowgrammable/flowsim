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

    a. Create the database and user

      > psql
      
      Create the database

        CREATE DATABASE <database name>;

      where
        <database name> = flowsim

      Create the database user

        CREATE USER <username> PASSWORD <password>;

      where
        <username> = flogdev
        <password> = flogdev
      
      Quit psql

        \q

    b. Modify the database server authorization file

      > <editor> <database server cluster>/pg_hba.conf

      Add the following line

        host <database name> <node username> 127.0.0.1/32 password

      where
        <database name> = flowsim
        <node username> = flogdev

      Quit psql

        \q

    c. Restart the database server

      > pg_ctl restart -D <database server cluster>

  3) Source the environment

    > source environment

  4) Run the migrations

    > flyway migrate

RUNNING
=======

  1) Start the server
    > node server.js&

NOTES
=====

  Pleaes see the notes/ directory for a set of notes on the various technologies
  used in this project.

