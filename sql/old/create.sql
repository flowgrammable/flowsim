CREATE TABLE switch
(
  name VARCHAR(32) NOT NULL PRIMARY KEY,
  version VARCHAR(5)
);

CREATE TABLE datapath
(
  switch_id VARCHAR(32) NOT NULL,
  datapath_id VARCHAR(16) NOT NULL UNIQUE,
  FOREIGN KEY(switch_id) REFERENCES switch(name)
);
