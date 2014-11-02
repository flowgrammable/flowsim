
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
