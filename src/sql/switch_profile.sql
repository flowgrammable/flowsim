-- create an enumerated type for ip fragment handling
CREATE TYPE IP_FRAG_HANDLING AS ENUM (
  'NORMAL',       -- no special handling for fragments
  'DROP',         -- drop fragments
  'REASSEMBLE',   -- reassemble if ip_reassembly is set).
  'MASK'          
);	

  --SWITCH PROFILE ---------------------------------------------------------------
CREATE TABLE switch_profile
(
  id SERIAL PRIMARY KEY,
  /*
   * Subscriber Id 
   * A subscriber can have many profiles
   * A profile can only belong to one subscriber
   */ 
  subscriber_id INTEGER references subscriber(id) /*NOT NULL*/,

  /*
   * Profile Name
   * example: 'brocade mlxe profile'
   */
  name VARCHAR(60) /*NOT NULL*/,

  --------------------------- Datapath Capabilities ---------------------------  
  /*
   * Openflow protocol version
   */
  ofp_version BYTEA /*NOT NULL*/,

  /*
   * Datapath Id - 
   *  Lower 48 bits for switch mac address
   *  Upper 16 bits are implementer defined
   */ 
  datapath_id BYTEA /*NOT NULL*/,

  /*
   * Number of buffers
   * maximum number of packets the switch can buffer when sending
   * packets to the controller using packet-in messages
   * (cut or keep?)
   */
  n_buffers BYTEA /*NOT NULL*/,

  /*
   * Number of Flowtables in switch data plane
   * 1.0 has only only 1 table
   * 1.1 - 1.4 can have multiple tables
   */
  n_tables BYTEA /*NOT NULL*/, 

  /*
   * IP reassembly
   * datapath can reassemble ip fragments
   */
  ip_reassembly BOOLEAN /*NOT NULL*/, 

  /*
   * stp
   * indicates whether a switch supports spanning-tree protocol
   */
  stp BOOLEAN /*NOT NULL*/, 

  /*
   * Port Blocked -  1.2, 1.3, 1.4
   * loops will be blocked by an external (non openflow) protocol
   */   
  port_blocked BOOLEAN /*NOT NULL*/,

  /* vendor_id/experimenter? */
  -----------------------------------------------------------------------------
  
  --------------------------- Datapath Description ----------------------------
  /*
   * Manufacturer description
   */
  mfr_description VARCHAR(60) /*NOT NULL*/,

  /*
   * Hardware description
   */
  hw_description VARCHAR(60) /*NOT NULL*/,

  /*
   * Software description
   */
  sw_description VARCHAR(60) /*NOT NULL*/, 

  /*
   * Serial number
   */
  serial_num VARCHAR(60) /*NOT NULL*/,

  /*
   * Description of the datapath
   */
  dp_description VARCHAR(60) /*NOT NULL*/,
  -----------------------------------------------------------------------------

  -------------------------- Datapath Configuration ---------------------------
   /*
    * miss_send_len
    * max bytes of flows sent to controller
    */
  miss_send_len INTEGER /*NOT NULL*/,
   
   /*
    * IP fragment handling
    * determines how to handle ip fragments
    */
  frag_handling IP_FRAG_HANDLING /*NOT NULL*/,
   
   /*
    * invalid_ttl_to_controller
    * 
    */
  invalid_ttl_to_controller BOOLEAN /*NOT NULL*/,
  -----------------------------------------------------------------------------

  ---------------------------- Ports Capabilities -----------------------------
  /*
   * Number of physical ports
   */
  n_ports BYTEA /*NOT NULL*/, 

  /*
   * Supported Virtual Ports
   *  (Req) All - 1.0
   *  (R) Controller - 1.0
   *  (R) Table - 1.0
   *  (R) In_Port - 1.0
   *  (R) Any - 1.2, 1.3, 1.4
   *  Local - 1.0 (R), 1.1 (O), 1.2(O), 1.3(O), 1.4(O)
   *  (O) Normal - 1.1, 1.2, 1.3, 1.4
   *  (O) Flood - 1.1, 1.2, 1.3, 1.4
   */ 
  vp_all BOOLEAN /*NOT NULL*/, 
  vp_controller BOOLEAN /*NOT NULL*/, 
  vp_table BOOLEAN /*NOT NULL*/,
  vp_in_port BOOLEAN /*NOT NULL*/,
  vp_any BOOLEAN /*NOT NULL*/,
  vp_local BOOLEAN /*NOT NULL*/,
  vp_normal BOOLEAN /*NOT NULL*/,
  vp_flood BOOLEAN /*NOT NULL*/,
  -----------------------------------------------------------------------------

  -------------------------- Statistics Capabilities --------------------------
  /* 
   * Supported Counters - 
   *   Flow Stats   -  1.0, 1.1, 1.2, 1.3, 1.4 
   *   Table Stats  -  1.0, 1.1, 1.2, 1.3, 1.4
   *   Port Stats   -  1.0, 1.1, 1.2, 1.3, 1.4
   *   Group Stats  -       1.1, 1.2, 1.3, 1.4
   *   Queue Stats  -  1.0, 1.1, 1.2, 1.3, 1.4
   */
  flow_stats BOOLEAN /*NOT NULL*/,
  table_stats BOOLEAN /*NOT NULL*/,
  port_stats BOOLEAN /*NOT NULL*/,
  group_stats BOOLEAN /*NOT NULL*/,
  queue_stats BOOLEAN /*NOT NULL*/,
  -----------------------------------------------------------------------------
);
