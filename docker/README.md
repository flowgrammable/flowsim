# Dockerizing Flowsim #

## Draft! Note: this is not a final implementation and approach, but starting point towards full automation"

## Database ##

1) To prepare PostgreSQL database with flowsim database user and schema run:

    sudo ./prepare-dock.sh

This script will create 2 containers postgres and data container for posgres.
Replacing variable values you can control name of the container and DB, user name and password.

    CONTAINER_NAME=flowsim-dev

    DB_USER=flowsim

    DB_USER_PASSWORD=flowsim

//TODO  - Fix the script to accept variables from the command line

2) Create Schema

    sudo ./create_schema.sh


## Node Server (backend) ##

1. Prepare code for distribution
* build flowsim-ui source


    cd /flowsim/flowsim-ui
    grunt dist

* build Flowsim-Node Docker image

For development purposes make changes in config.json to match DB-USER name

    "database": {
        "database": "flowsim",
        "host": "postgres",
        "user": "flowsim",
        "pwd": "flowsim"
    },

Build the docker image.

    cd/flowsim/backend
    sudo docker build -t flowgrammable/flowsim-server .

 Run the Flowsim server


    sudo run-node.sh

