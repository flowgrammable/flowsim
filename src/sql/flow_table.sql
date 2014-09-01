-- create an enumerated type for ip fragment handling
CREATE TYPE IP_FRAG_HANDLING AS ENUM (
  'NORMAL',       -- no special handling for fragments
  'DROP',         -- drop fragments
  'REASSEMBLE',   -- reassemble if ip_reassembly is set).
  'MASK'          
);	

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
