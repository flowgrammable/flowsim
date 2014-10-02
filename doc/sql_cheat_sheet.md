##### Select all rows from table:
> SELECT * FROM your_table;

##### Select specific columns for all rows of a table:
> SELECT column_x, column_y, column_z FROM your_table;

##### Select rows from a table that match a specified value in column_x:
> SELECT * FROM your_table WHERE column_x = 'a specified value';

##### Select all rows from two tables where there is a match between columns in both tables:
> SELECT * FROM table1 INNER JOIN table2 ON table1.column_x = table2.column_y;
