
INSERT INTO switch_profile
  (name, datapath_id, n_buffers, n_tables)
  VALUES('noviflow-1020', 'aabbccddeeff', 1024, 128);

INSERT INTO table_profile
  (id, n_flows, switch_id)
  VALUES(1, 2000, 1);

