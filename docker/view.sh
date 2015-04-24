#!/bin/bash
CONTAINER_NAME=flowsim-dev
DB_USER=flowsim
DB_USER_PASSWORD=flowsim
SQL_FILE=/tmp/V1__subscriber.sql
set -x
docker run -it --link $CONTAINER_NAME-postgres:postgres --volumes-from flowsim-dev-data postgres sh -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U '$DB_USER' -d '$DB_USER''
