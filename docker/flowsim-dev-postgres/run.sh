#!/bin/bash

psql -U '$DB_USER' -d '$DB_USER' -a -f V1__subscriber.sql
