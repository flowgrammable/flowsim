
Overview
========

  REST services are HTTP based remote procedure invocation that provide the 
  basic CRUD operations: Create, Read, Update, and Delete.

Create - HTTP POST
--------------------

curl -d 'params' url

Read - HTTP GET
--------------------

curl url

Update - HTTP PUT
--------------------

curl -X PUT url

Delete - HTTP DELETE
--------------------

curl -X DELETE url

TLS/SSL Options
---------------
-1 - TLSv1
-2 - SSLv2
-3 - SSLv3

Cookie Options
--------------

-b 'p1=1;p2=2'  -- use cookies from param list in request
-b <file>       -- write response cookies to file
-c <file>       -- use cookies from file in request
