
FILES DIRS
------------
- package.json    - main npm configuration
- config.json     - basic configuraiton file
- keys/           - SSL certs for local/dev site
- src/index.js    - main entry point
- src/database/   - database engine (postgres)
- src/mailer/     - smtp engine
- src/template/   - template engine
- src/templates/  - HTML templates (*.ejs)
- src/subscruber/ - subscriber/session services

GET
====
curl --cacert keys/localhost.crt https://localhost:3000/api/subscriber/verify/1

POST
====
-H "Content-Type: application/json" -d '{ "email":"j@j.c", "pwd": "123" }'

NOTES
=====
- sometimes curl will not try IPv4 address of 127.0.0.1 on localhost
  to resolve use the option '-ipv4'

DOCKER
======

- Posgres container sets following env variables on linked node.
POSTGRES_ENV_POSTGRES_USER=flowsim
POSTGRES_PORT=tcp://172.17.0.33:5432
POSTGRES_ENV_POSTGRES_PASSWORD=flowsim
POSTGRES_ENV_LANG=en_US.utf8
POSTGRES_ENV_PG_MAJOR=9.4
POSTGRES_PORT_5432_TCP_PORT=5432
POSTGRES_PORT_5432_TCP_ADDR=172.17.0.33
POSTGRES_ENV_PGDATA=/var/lib/postgresql/data
POSTGRES_NAME=/flowsim-node/postgres
POSTGRES_PORT_5432_TCP=tcp://172.17.0.33:5432
POSTGRES_PORT_5432_TCP_PROTO=tcp
POSTGRES_ENV_PG_VERSION=9.4.1-1.pgdg70+1
