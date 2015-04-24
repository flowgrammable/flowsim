#!/bin/sh

# build the containers
docker create -v /var/lib/postgresql/data --name flowsim-dev-data postgres
cd flowsim-dev-postgres && docker build --no-cache -t flowsim-dev-postgres .
cd flowsim-dev-nginx && docker build --no-cache -t flowsim-dev-nginx .
cd flowsim-dev-node && docker build --no-cache -t flowsim-dev-node .

