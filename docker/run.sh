#!/bin/bash
# stop running containers
docker rm $(docker stop -t=1 $(docker ps -q))
docker rm $(docker ps -aq)
docker rm flowsim-dev-data

# create postgres data container
docker create -v /var/lib/postgresql/data --name flowsim-dev-data postgres

# start all flowsim containers and display logs
docker-compose up -d
sleep 3
./create_schema.sh
docker-compose logs

