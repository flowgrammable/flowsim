#!/bin/bash
# This script will perform a HTTP DELETE request on the resource /users/0
# Running this script will result in the user with an id of 0 being deleted
curl -H 'Content-Type: application/json' -X DELETE localhost:3000/users/0
