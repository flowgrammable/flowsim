#!/bin/bash

docker run --rm --volumes-from $1 postgres -lh $2
