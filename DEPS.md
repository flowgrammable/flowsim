GLOBAL DEPENDENCIES
--------------------

  Note: If you are using the Flowgrammable development appliance you can skip 
  the global dependencies step. 

  Base dependencies
  
  1) Nodejs - the core Nodejs framework

    <install nodejs using your package manager dejour>

  2) NPM - Node Package Manager

    <install npm using your package manager dejour>

  3) cURL - command line http client

    <install curl using your package manager dejour>

  4) PostgreSQL - sql database, server, and utilities

    <install postgresql using your package manager dejour>

  5) Java 1.6 or higher

  Dependencies we can install with npm

  1) Bower - this is a 'front-end' package manager
  
    sudo npm install -g bower

  2) grunt - this is a script runner and build system

    sudo npm install -g grunt-cli

  3) yuijs - this is a javascript documentation generator

    sudo npm -g install yuidocjs

LOCAL DEPENDENCIES
------------------

  1) Install local nodejs and bower dependencies

    npm install
    bower install

  2) Build the ui-bootstrap bower package

    cd bower_components/ui-bootstrap
    npm install
    grunt
    cd ../..

  3) Initialize the postreSQL database

    * put instructions here

UDATING DEPENDENCIES
---------------------

  GLOBAL UPDATES

    sudo npm -g update

  LOCAL UPDATES

    npm update
    bower update

