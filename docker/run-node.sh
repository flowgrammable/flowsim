#!/bin/bash
NODE_NAME=flowsim-node
POSTGRES_NAME=flowsim-dev-postgres
PORT=8080
TLS_PORT=8081
set -x
docker run --name $NODE_NAME --link $POSTGRES_NAME:postgres -d -p $PORT:8080 -p $TLS_PORT:8081 flowgrammable/flowsim-server