#!/bin/bash

docker run --rm --volumes-from $1 postgres ls -lh $2
