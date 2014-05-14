#!/bin/sh
curl -H "Content-Type: application/json" -d '{"id":101, "name":"test profile","no_ports":30}'  localhost:3000/api/profile
