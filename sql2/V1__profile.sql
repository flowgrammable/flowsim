
CREATE TYPE version AS ENUM ('1.0', '1.1');

-- create a profile
CREATE TABLE profile
(
  id SERIAL PRIMARY KEY,
  name CHAR(128) NOT NULL ,
  switch_version version, 
  no_ports INTEGER NOT NULL,
  no_tables INTEGER NOT NULL,
  table_size INTEGER NOT NULL
);
  

