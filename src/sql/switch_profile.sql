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
  ofp_version BYTEA  /*NOT NULL*/,

  /*
   * datapath_id 
   * 
   */
   datapath_id BYTEA /*NOT NULL*/,

  /*
	 * n_buffers
   */
   n_buffers BYTEA /*NOT NULL*/,

  /*
   * n_tables
   * number of flowtable in the datapath
   */
   n_tables BYTEA /*NOT NULL*/, 

  /*
   * ip_reassembly
   * datapath can reassemble ip fragments
   */
   ip_reassembly BOOLEAN /*NOT NULL*/, 

  /*
   * stp
   * indicates whether a switch supports spanning-tree protocol
   */
   stp BOOLEAN /*NOT NULL*/, 

  /*
   * port_blocked
   * loops will be blocked by an external (non openflow) protocol
   */   
   port_blocked BOOLEAN /*NOT NULL*/,

  /* vendor_id/experimenter? */
  -----------------------------------------------------------------------------
  
  --------------------------- Datapath Description ----------------------------
  /*
   * mfr_description
   * manufacturer description
   */
   mfr_description VARCHAR(60) /*NOT NULL*/,

  /*
   * hw_description
   * hardware description
   */
   hw_description VARCHAR(60) /*NOT NULL*/,

  /*
   * sw_description
   * software description
   */
   sw_description VARCHAR(60) /*NOT NULL*/, 

  /*
   * serial_num
   * serial number
   */
   serial_num VARCHAR(60) /*NOT NULL*/,

  /*
   * dp_description
   * description of the datapath
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
    * frag_handling
    * 
    */
   frag_handling IP_FRAG_HANDLING /*NOT NULL*/,
   
   /*
    * invalid_ttl_to_controller
    * 
    */
   invalid_ttl_to_controller BOOLEAN /*NOT NULL*/,
  ----------------------------------------------------------------------------
);
