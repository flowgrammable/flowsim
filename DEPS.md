GLOBAL DEPENDENCIES
--------------------

  Note: If you are using the Flowgrammable development appliance you can skip 
  the global dependencies step. 

  Base dependencies
  
  1) Nodejs - the core Nodejs framework

    <install nodejs using your package manager dejour>

  2) cURL - command line http client

    <install curl using your package manager dejour>

  3) PostgreSQL - sql database, server, and utilities

    <install postgresql using your package manager dejour>

  5) Java 1.6 or higher

  Dependencies we can install with npm

  1) Bower - this is a 'front-end' package manager
  
    sudo npm install -g bower

  2) grunt - this is a script runner and build system

    sudo npm install -g grunt-cli

LOCAL DEPENDENCIES
------------------

  1) Install local nodejs and bower dependencies

    cd src/backend
    npm install
    cd ../frontend
    bower install

  2) Build the ui-bootstrap bower package

    cd bower_components/angular-ui-bootstrap
    npm install
    grunt
    cd ../../../backend
    npm install

  3) Initialize the postreSQL database

    initdb <name of database cluster>          -- initializes a new db cluster
    pg_ctl -D <name of database cluster> start -- starts the db process
    createdb <name of database>                -- creates a db      (flowsim)
    createuser <name of user>                  -- creates a db user (flogdev)

PROBLEMS
--------

Sometimes your account ~/.npm/ directories loose their proper ownership. This
can happen from excessive use of the 'sudo' command. Unless you are installing a
package globally with the '-g' option you should not be using 'sudo'.

The problem is that at some point the use of 'sudo' changed ownership of some of
your ~/.npm/ files to root. You can change this back pretty easily with the
following command:

  sudo chown -R `whoami` ~/.npm/

Now you sould be able to install local packages without any EACCESS errors
demanding that you should be using 'sudo' when you clearly should not.

UDATING DEPENDENCIES
---------------------

  GLOBAL UPDATES

    sudo npm -g update

  LOCAL UPDATES

    npm update
    bower update

