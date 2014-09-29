#!/bin/bash
# This script will perform a HTTP PUT request on the resource /users/0
# Running this script will result in the user with an id of 0 to be updated with the name
# coooooolton
curl -H 'Content-Type: application/json' -X PUT -d '{"name":"coooooolton"}' localhost:3000/users/0
