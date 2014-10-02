
#Flowsim

Flowsim is a visualization of the OpenFlow abstract data plane. The simulator is
built using javascript, html, css, and posgres. The tool is meant to be run in a
browser with a remote RESTful service providing data persistence.

##Organiation

The project is organized into the following subdirectories:
- 3rdparty
- doc
- backend
- frontend

Our project currently uses a 3rd party tool called Flyway for SQL database
migrations. This tool depends on java 1.6 or higher and certain environment
variables being set. The tool is located in the '3rdparty' directory.

Drawings and documentation about the design of the system can be found int
'doc' directory. At the moment this is just a collection of notes and not that
organized.

The RESTful API for the service is located in the 'backend' directory. This is
an HTTP/S server using the Restify javascript framework to modularly serve
RESTful API services. This is our persistence layer for flowsim.

The bulk of the application runs in a modern javascript capable broswer and the
code is located in the 'frontend' directory. The frontend relies on the
angularjs UI framework and the bootstrap css styling library.

##Global Dependencies

This project has a minimal number of external dependencies. You must ensure
these dependencies are present before attempting the installation process.
- java 1.6 or higher
- nodejs
- postgresql 9.3
- curl (optional)

Java is only used by the flyway migration tool. The entire site is built in
javascript and the backend depends on nodejs to run. Persistence is provided
through a postgresql database. Finaly, if you are doing development you may need
the cURL command line utility. In which case now is the time to install it.This
set of dependencies you must manually install before proceeding with the
installation procedure.

##Installation

If a step does not explicitly tell you to use the sudo command, do not use it.

###Setup Procedure

Before installing either the frontend or backend you need a few node development
tools; grunt-cli, and bower. Our first step is to install these as global npm
packages using the '-g' option.
- sudo npm install -g grunt-cli
- sudo npm install -g bower

During this process it is possible that you have accidentally changed ownership
of some of your node package management configuration files. This will cause
problems during subsequent steps. So as a provalactic we will ensure your
package management configuration files are owned properly. Execute the following
command:
- sudo chown -R `whoami` ~/.npm

###Backend Procedure

- cd backend    <- change to the backend directory
- npm install   <- install the basic node dependencies
- cd ..         <- change back to the top level directory

###Frontend Procedure

- cd frontend   <- change to the frontend directory
- npm install   <- install the node dependencies (includes bower)
- grunt init    <- compile all un-built dependencies
- cd ..         <- change back to the top level directory

##Operation

###Updating Dependencies

- npm update
- bower update
