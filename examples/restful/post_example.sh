#!/bin/bash
# This script will perform a HTTP POST request on the resource /users
# Running this script will result in an id being generated for a user, and a name assigned to theid
curl -H 'Content-Type: application/json' -d '{"name":"colton"}' localhost:3000/users
