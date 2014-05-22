PostgreSQL v/s MySQL
--------------------
--------------------

In Postgresql:
--------------
postgres=# CREATE TABLE testTable(id int not null,text1 VARCHAR(50) NOT NULL, text2 VARCHAR(50) NOT NULL default 'rob');
CREATE TABLE

In Mysql:
---------
mysql> CREATE TABLE testTable(id int not null,text1 VARCHAR(50) NOT NULL, text2 VARCHAR(50) NOT NULL default 'rob');
Query OK, 0 rows affected (0.12 sec)


In Postgresql:
--------------
postgres=# INSERT INTO testTable(id) VALUES (2);
ERROR:  null value in column "text1" violates not-null constraint

postgres=# SELECT * FROM testTable WHERE text1 = '';
 id | text1 | text2 
----+-------+-------
(0 rows)

postgres=# INSERT INTO testTable(id,text1) VALUES (3,NULL);
ERROR:  null value in column "text1" violates not-null constraint

In Mysql:
---------
mysql> INSERT INTO testTable(id) VALUES (2);
Query OK, 1 row affected, 1 warning (0.06 sec)

mysql> SELECT * FROM testTable WHERE text1 = '';
+----+-------+-------+
| id | text1 | text2 |
+----+-------+-------+
|  2 |       | rob   |
+----+-------+-------+
1 row in set (0.00 sec)

mysql> INSERT INTO testTable(id,text1) VALUES (3,NULL);
ERROR 1048 (23000): Column 'text1' cannot be null


In Postgresql:
--------------
postgres=# ALTER TABLE testTable ADD time TIMESTAMP NOT NULL;
ALTER TABLE
postgres=# SELECT * FROM testTable;
 id | text1 | text2 | time 
----+-------+-------+------
(0 rows)

In Mysql:
---------
mysql> ALTER TABLE testTable ADD time TIMESTAMP NOT NULL;
Query OK, 1 row affected (0.32 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM testTable;
+----+-------+-------+---------------------+
| id | text1 | text2 | time                |
+----+-------+-------+---------------------+
|  2 |       | rob   | 0000-00-00 00:00:00 |
+----+-------+-------+---------------------+
1 row in set (0.00 sec)


In Postgresql:
--------------
postgres=#  INSERT INTO testTable(id,text1,time) VALUES (3,'NOT NULL',NULL);
ERROR:  null value in column "time" violates not-null constraint

In Mysql:
---------
mysql> SELECT * FROM testTable;
+----+----------+-------+---------------------+
| id | text1    | text2 | time                |
+----+----------+-------+---------------------+
|  2 |          | rob   | 0000-00-00 00:00:00 |
|  3 | NOT NULL | rob   | 2014-05-22 13:55:11 |
+----+----------+-------+---------------------+
2 rows in set (0.00 sec)


In Postgresql:
--------------
postgres=# ALTER TABLE testTable ADD money DECIMAL(2);
ALTER TABLE

postgres=# INSERT INTO testTable(id,text1,time,money) VALUES (3,'MONEY','2014-05-22 13:55:11',100);
ERROR:  numeric field overflow
DETAIL:  A field with precision 2, scale 0 must round to an absolute value less than 10^2.

In Mysql:
---------
mysql> ALTER TABLE testTable ADD money DECIMAL(2);
Query OK, 2 rows affected (0.31 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> INSERT INTO testTable(id,text1,time,money) VALUES (3,'MONEY',NULL,100);Query OK, 1 row affected, 1 warning (0.06 sec)

mysql> SELECT * FROM testTable;
+----+----------+-------+---------------------+-------+
| id | text1    | text2 | time                | money |
+----+----------+-------+---------------------+-------+
|  3 | MONEY    | rob   | 2014-05-22 13:59:57 |    99 |
+----+----------+-------+---------------------+-------+
1 rows in set (0.00 sec)


In Postgresql:
--------------
postgres=# SELECT 1/0;
ERROR:  division by zero

In Mysql:
---------
mysql> SELECT 1/0;
+------+
| 1/0  |
+------+
| NULL |
+------+
1 row in set (0.00 sec)


In Postgresql:
--------------
postgres=# SELECT now()/0;
ERROR:  operator does not exist: timestamp with time zone / integer
LINE 1: SELECT now()/0;
                    ^
HINT:  No operator matches the given name and argument type(s). You might need to add explicit type casts.

In Mysql:
---------
mysql> SELECT now()/0;
+---------+
| now()/0 |
+---------+
|    NULL |
+---------+
1 row in set (0.00 sec)


In Postgresql:
--------------
postgres=# ALTER TABLE testTable ADD text3 VARCHAR(4);
ALTER TABLE

postgres=# INSERT INTO testTable(id,text1,text2,time,money,text3) VALUES(1,'overflow','check',now(),5,'Flowgrammable');
ERROR:  value too long for type character varying(4)

In Mysql:
---------
mysql> ALTER TABLE testTable ADD text3 VARCHAR(4);
Query OK, 3 rows affected (0.31 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> INSERT INTO testTable VALUES(1,'overflow','check',now(),5,"Flowgrammable");
Query OK, 1 row affected, 1 warning (0.04 sec)

mysql> SELECT * FROM testTable;
+----+----------+-------+---------------------+-------+-------+
| id | text1    | text2 | time                | money | text3 |
+----+----------+-------+---------------------+-------+-------+
|  1 | overflow | check | 2014-05-22 14:07:46 |     5 | Flow  |
+----+----------+-------+---------------------+-------+-------+
1 rows in set (0.00 sec)


In Postgresql:
--------------
postgres=# INSERT INTO testTable VALUES(1,'string','in dec',now(),'HI THis is dec','ok');
ERROR:  invalid input syntax for type numeric: "HI THis is dec"
LINE 1: ...nsert INTO testTable VALUES(1,'string','in dec',now(),'HI THis i...

In Mysql:
---------
mysql> INSERT INTO testTable VALUES(1,'string','in dec',now(),"HI THis is dec","Ok");
Query OK, 1 row affected, 1 warning (0.03 sec)

mysql> SELECT * FROM testTable;
+----+----------+--------+---------------------+-------+-------+
| id | text1    | text2  | time                | money | text3 |
+----+----------+--------+---------------------+-------+-------+
|  1 | string   | in dec | 2014-05-22 14:17:50 |     0 | Ok    |
+----+----------+--------+---------------------+-------+-------+
1 rows in set (0.00 sec)
