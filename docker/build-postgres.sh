#!/bin/sh

# create the data container
docker create -v /var/lib/postgresql/data --name flowsim-dev-data postgres
# build a flowsim-postgres container
cd flowsim-dev-postgres && docker build --no-cache -t flowsim-dev-postgres .
# start the flowsim-postgres container
docker run -it -d flowsim-dev-postgres 

