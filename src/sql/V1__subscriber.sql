
-- create an enumerated type for the account status
CREATE TYPE SUBSCRIBERS_STATUS AS ENUM (
  'CREATED',  -- a sub has been registered but not verified, logins should not be possible
  'ACTIVE',   -- a sub has verified and can actively login
  'RESET',    -- a sub has had their password reset, no logins possible only pwd reset procedure
  'CLOSED'    -- a sub has been closed, no functionality is supported against this state
);

-- create the primary subscriber table
CREATE TABLE subscriber
(
  id SERIAL PRIMARY KEY,                          -- internal id uses for sub
  email VARCHAR(128) NOT NULL UNIQUE,             -- email owned by sub
  password CHAR(60) NOT NULL,                     -- hashed pwd of sub
  reg_date TIMESTAMP WITH TIME ZONE NOT NULL,     -- date/time of registration
  reg_ip INET NOT NULL,                           -- ip used for registration
  verification_token CHAR(36) NOT NULL,           -- verification token
  reset_token CHAR(36),                           -- password reset token
  status SUBSCRIBERS_STATUS NOT NULL              -- current sub disposition
  -- status_date TIMESTAMP WITH TIME ZONE NOT NULL,  -- date of last change in disp
);

-- create a session table
CREATE TABLE session
(
  id SERIAL PRIMARY KEY,                              -- internal sesison id
  subscriber_id INTEGER references subscriber(id) NOT NULL,   -- reference to sub
  key CHAR(36) NOT NULL UNIQUE,                       -- session key for API
  -- begin_time TIMESTAMP WITH TIME ZONE NOT NULL,       -- date/time session began
  timeout BIGINT /*NOT NULL,*/     -- date/time for session to end
  -- ip INET NOT NULL                                    -- ip used for session
);

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
  ofp_version INTEGER /*NOT NULL*/,

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
  n_buffers INTEGER /*NOT NULL*/,

  /*
   * Number of Flowtables in switch data plane
   * 1.0 has only only 1 table
   * 1.1 - 1.4 can have multiple tables
   */
  n_tables INTEGER /*NOT NULL*/, 

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
  n_ports INTEGER /*NOT NULL*/, 

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
  queue_stats BOOLEAN /*NOT NULL*/
  -----------------------------------------------------------------------------
);

--FLOW TABLE CAPS AND CONFIG---------------------------------------------------
CREATE TABLE flowtable
(
  id SERIAL PRIMARY KEY,
  /*
   * Profile ID
   * A profile can have many flow_tables
   * Openflow 1.0 only supports 1 flow_table
   */ 
  profile_id INTEGER references switch_profile(id) NOT NULL,

  /*
   * Flowtable ID
   * 1 byte
   */
	flowtable_id INTEGER NOT NULL,

  /*
   * Flowtable Name
   * 
   */
  name VARCHAR(60) /*NOT NULL*/,

	/*
   * Max Entries
   * 4 bytes
   */
  max_entries BYTEA ,


  /*
   * Flow table configuration
   * 
   */
  miss_controller BOOL ,
  miss_conintue BOOL ,
  miss_drop BOOL ,
  eviction BOOL ,
  vacancy BOOL ,

  /*
   * FlowTable Stats
   * active_count - number of entries in table - 4 byte
   * lookup_count - number of packets looked up in table -8 bytes
   * matched_count - number of packets that hit the table - 8 bytes
   */
  active_count BYTEA ,
  lookup_count BYTEA ,
  matched_count BYTEA 
);

CREATE TYPE FIELD_TYPES AS ENUM (
  'OFPXMT_OFB_IN_PORT', 
  'OFPXMT_OFB_IN_PHY_PORT',
  'OFPXMT_OFB_METADATA',
  'OFPXMT_OFB_ETH_DST',
  'OFPXMT_OFB_ETH_SRC',
  'OFPXMT_OFB_ETH_TYPE'
);
-- Field Capabilities ----------------------------------------------------------
CREATE TABLE field_capability
(
  id SERIAL PRIMARY KEY,

  /*
   * Flow table ID
   * Each flow table is able to match / and apply actions to a field
   * field_caps belong to a single flow table
   */
  flowtable_id INTEGER REFERENCES flowtable(id) NOT NULL,

  /*
   * Field_Type
   * Specifies the field from enum FIELD_Types
   */
   field_type FIELD_TYPES NOT NULL,

   /*
    * Specifies what matches/actions are supported with this field
    */
    match BOOLEAN,
    wildcards BOOLEAN,
    write_setfield BOOLEAN,
    write_setfield_miss BOOLEAN,
    apply_setfield BOOLEAN,
    apply_setfield_miss BOOLEAN
);


CREATE TYPE ACTION_TYPES AS ENUM (
  --Required--
  'OFPAT_OUTPUT',
  'DROP',
  'OFPAT_GROUP',
  --Optional--
  'OFPAT_COPY_TTL_OUT',
  'OFPAT_COPY_TTL_IN',
  'OFPAT_SET_MPLS_TTL',
  'OFPAT_DEC_MPLS_TTL',
  'OFPAT_PUSH_VLAN',
  'OFPAT_POP_MPLS',
  'OFPAT_SET_QUEUE',
  'OFPAT_SET_NW_TTL',
  'OFPAT_DEC_NW_TTL',
  'OFPAT_SET_FIELD',
  'OFPAT_PUSH_PBB',
  'OFPAT_POP_PBB',
  'OFPAT_EXPERIMENTER'
);

CREATE TABLE action_capability
(
  id SERIAL PRIMARY KEY,

  /*
   * Flow Table ID
   * a flow table can have many action_capabilities by action type
   */
  flowtable_id INTEGER REFERENCES flowtable(id) NOT NULL,

  /*
   * Action Type
   * specifies the action from the ACTION_TYPES
   */
  action_type ACTION_TYPES NOT NULL,

  /*
   * specifies whether action type supports write/apply
   */
  write_actions BOOLEAN,
  write_actions_miss BOOLEAN,
  apply_actions BOOLEAN,
  apply_actions_miss BOOLEAN
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
CREATE TABLE instruction_capability 
(
    id SERIAL PRIMARY KEY,

    /*
     * Flow Table ID
     * Each flow table supports configurable instruction capabilities
     *
     */
     flowtable_id INTEGER references flowtable(id) NOT NULL,

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
-----Packet --------------------------------------------------------------------
CREATE TABLE packet
(
   id SERIAL PRIMARY KEY,
   subscriber_id INTEGER references subscriber(id) NOT NULL,
   name VARCHAR(60) NOT NULL,
   bytes INTEGER,
	 eth_src_mac BYTEA NOT NULL,
   eth_dst_mac BYTEA NOT NULL,
	 eth_type BYTEA NOT NULL 
);

CREATE TABLE ethernet
(
  id SERIAL PRIMARY KEY,
  packet_id INTEGER references packet(id) NOT NULL,
  eth_src_mac BYTEA NOT NULL,
  eth_dst_mac BYTEA NOT NULL,
  eth_type BYTEA NOT NULL
);

CREATE TABLE VLAN
(
  id SERIAL PRIMARY KEY,
  ethernet_id INTEGER references ethernet(id) NOT NULL,
  eth_vlan_vid BYTEA NOT NULL,
  eth_vlan_pcp BYTEA NOT NULL,
  eth_type BYTEA NOT NULL
);

CREATE TABLE MPLS
(
  id SERIAL PRIMARY KEY,
  ethernet_id INTEGER references ethernet(id) NOT NULL,
  mpls_label BYTEA NOT NULL,
  mpls_tc BYTEA NOT NULL,
  mpls_bos_bit BYTEA NOT NULL
);

CREATE TABLE ARP
(
  id SERIAL PRIMARY KEY,
  ethernet_id INTEGER references ethernet(id) NOT NULL,
  arp_op BYTEA NOT NULL,
  arp_sha BYTEA NOT NULL,
  arp_spa BYTEA NOT NULL,
  arp_tha BYTEA NOT NULL,
  arp_tpa BYTEA NOT NULL
);

CREATE TABLE IPv4
(
  id SERIAL PRIMARY KEY,
  packet_id INTEGER references packet(id),
  ipv4_dscp BYTEA,
  ipv4_ecn BYTEA ,
  ipv4_proto BYTEA NOT NULL,
  ipv4_src BYTEA NOT NULL,
  ipv4_dst BYTEA NOT NULL
);

CREATE TABLE IPv6
(
  id SERIAL PRIMARY KEY,
  ethernet_id INTEGER references ethernet(id),
  VLAN_id INTEGER references VLAN(id),
  MPLS_id INTEGER references MPLS(id),
  ipv6_dscp BYTEA NOT NULL,
  ipv6_ecn BYTEA NOT NULL,
  ipv6_proto BYTEA NOT NULL,
  ipv6_src BYTEA NOT NULL,
  ipv6_dst BYTEA NOT NULL,
  ipv6_flabel BYTEA NOT NULL,
  ipv6_exthdr BYTEA NOT NULL
);

CREATE TABLE ICMPv4
(
  id SERIAL PRIMARY KEY,
  ipv4_id INTEGER references IPv4(id) NOT NULL,
  icmpv4_type BYTEA NOT NULL,
  icmpv4_code BYTEA NOT NULL
);

CREATE TABLE ICMPv6
(
  id SERIAL PRIMARY KEY,
  ipv6_id INTEGER references IPv6(id) NOT NULL,
  icmpv6_type BYTEA NOT NULL,
  icmpv6_code BYTEA NOT NULL,
  icmpv6_nd_target BYTEA NOT NULL,
  icmpv6_nd_sll BYTEA NOT NULL,
  icmpv6_nd_tll BYTEA NOT NULL
);

CREATE TABLE Layer4
(
  id SERIAL PRIMARY KEY,
  ipv4_id INTEGER references IPv4(id) NOT NULL,
  ipv6_id INTEGER references IPv6(id) NOT NULL,
  src_port BYTEA NOT NULL,
  dst_port BYTEA NOT NULL
);

