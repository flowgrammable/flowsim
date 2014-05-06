
CREATE TABLE switch_profile
(
  /* primary key and human readable name */
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(32) NOT NULL UNIQUE,

  /* StatsReq(Desc) */
  manufacturer VARCHAR(256),
  hardware VARCHAR(256),
  software VARCHAR(256),
  serial VARCHAR(32),
  datapath VARCHAR(256),

  /* datapath properties */
  datapath_id VARCHAR(16),
  n_buffers INTEGER NOT NULL,
  n_tables INTEGER NOT NULL
);

CREATE TABLE table_profile
(
  id INTEGER PRIMARY KEY,
  n_flows INTEGER NOT NULL,

  /* Link to switch profile*/
  switch_id INTEGER,
  FOREIGN KEY(switch_id) REFERENCES switch_profile(id)
);

