#!/bin/bash
CONTAINER_NAME=test_postgres_1
DB_USER=flowsim
DB_USER_PASSWORD=flowsim
SQL_FILE=/tmp/V1__subscriber.sql
set -x
docker run --link $CONTAINER_NAME:postgres -v /vagrant/backend/sql:/tmp -e "PGPASSWORD=flowsim" postgres sh -c 'PGPASSWORD=flowsim exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U '$DB_USER' -d '$DB_USER' -a -f '$SQL_FILE
