--FLOW TABLE CAPS AND CONFIG---------------------------------------------------
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
   * Each flow table supports configurable capabilities
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

--- Action Types --------------------------------------------------------------
CREATE TYPE action AS ENUM
(
    'SET_FIELD'
);

--- Action Capabilities -------------------------------------------------------
CREATE TABLE action_capability
(
    id SERIAL PRIMARY KEY,

   /*
    * Flow Table ID
    * Each flow table supports configurable action capabilities
    *
    */
    flow_table_id INTEGER references flow_table(id) NOT NULL,

    /*
     * action_type
     * 
     */
     action_type action NOT NULL,

    /*
     * write_action - bool
     * indicates flow table is able to write_action_(action_type)
     * 
     */ 
     write_action BOOL,

    /*
     * write_action_miss - bool
     * indicates flow table is able to write_action_(action_type)
     * on a table miss
     */
     write_action_miss BOOL,

    /*
     * apply_action - bool
     * indicates flow table is able to apply_action_(action_type)
     *
     */
     apply_action BOOL,

    /*
     * apply_action_miss - bool
     * indicates flow table is able to apply_action_(action_type)
     * on table miss
     */
     apply_action_miss BOOL
);

--- Instruction Capability --------------------------------------------------
CREATE TYPE instruction as ENUM
(
    /*
     * Required instructions:
     * - goto_table
     * - write_action
     */
     'WRITE_METADATA',
     'APPLY_ACTIONS',
     'CLEAR_ACTIONS'
);

--- Instruction Capability --------------------------------------------------
CREATE TYPE instruction_capability 
(
    id SERIAL PRIMARY KEY,

    /*
     * Flow Table ID
     * Each flow table supports configurable instruction capabilities
     *
     */
     flow_table_id INTEGER references flow_table(id) NOT NULL,

    /*
     * instruction_type
     */
     instruction_type instruction NOT NULL,

    /*
     * instruction
     * indicates flow table is able to execute instruction_type
     */
     instruction BOOL,

    /*
     * instruction_miss
     * indicates flow table is able to execute instruction_type on
     * table miss
     */
     instruction_miss BOOL
);
