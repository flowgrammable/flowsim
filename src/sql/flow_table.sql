--FLOW TABLE CAPS AND CONFIG---------------------------------------------------------------
CREATE TABLE flow_table
(
  id SERIAL PRIMARY KEY,
  /*
   * Profile ID
   * A profile can have many flow_tables
   * Openflow 1.0 only supports 1 flow_table
   */ 
  profile_id INTEGER references subscriber(id) NOT NULL,

  /*
   * Flowtable ID
   * 1 byte
   */
	flowtable_id BYTEA NOT NULL,

  /*
   * Flowtable Name
   * 
   */
  name VARCHAR(60) NOT NULL,

	/*
   * Max Entries
   * 4 bytes
   */
  max_entries BYTEA NOT NULL,


  /*
   * Flow table configuration
   * 
   */
  miss_controller BOOL NOT NULL,
  miss_conintue BOOL NOT NULL,
  miss_drop BOOL NOT NULL,
  eviction BOOL NOT NULL,
  vacancy BOOL NOT NULL,

  /*
   * FlowTable Stats
   * active_count - number of entries in table - 4 byte
   * lookup_count - number of packets looked up in table -8 bytes
   * matched_count - number of packets that hit the table - 8 bytes
   */
  active_count BYTEA NOT NULL,
  lookup_count BYTEA NOT NULL,
  matched_count BYTEA NOT NULL
);

--Field Types------------------------------------------------------------------
CREATE TYPE field AS ENUM
(
	'ETH_DST',
	'ETH_SRC',
	'ETH_TYPE'
);

--Field Capabilities-----------------------------------------------------------
CREATE TABLE field_capability 
(
  id SERIAL PRIMARY KEY,
 
  /*
   * Flow Table ID
   * Each flow table supports configurable field capabilities
   * 
   */ 
  flow_table_id INTEGER references flow_table(id) NOT NULL,

  /*
   * Field Type
   * 
   */
   field_type field NOT NULL,

  /*
   * Match - bool
   * indicates flow table is able to match on field
   *
   */
   match BOOL,

  /*
   * wildcards - bool
   * indicates flow table is able to wildcard on field
   *
   */
   wildcard BOOL,

  /*
   * write_setfield - bool
   * indicates flow table is able write set_field_(field_type)
   *
   */
   write_setfield BOOL,

  /*
   * write_setfield_miss - bool
   * indicates flow table is able to write set_field_(field_type)
   * on table miss
   */
   write_setfield_miss BOOL,

  /*
   * apply_setfield - bool
   * indicates flow table is able to apply set_field_(field_type)
   */
   apply_setfield BOOL,

  /*
   * apply_setfield_miss - bool
   * indicates flow table is able to apply set_field_(field_type)
   * on table miss
   */
   apply_setfield_miss BOOL

);
