#!/bin/bash

CONTAINER_NAME=flowsim-dev
DB_USER=flowsim
DB_USER_PASSWORD=flowsim
set -x
docker run --name $CONTAINER_NAME-data --entrypoint /bin/echo postgres Data-only container for Flowsim
docker run --name $CONTAINER_NAME-postgres -e POSTGRES_PASSWORD=$DB_USER_PASSWORD -e POSTGRES_USER=$DB_USER --volumes-from $CONTAINER_NAME-data -d postgres

