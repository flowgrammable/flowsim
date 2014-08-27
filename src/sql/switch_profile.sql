	--SWITCH PROFILE ---------------------------------------------------------------
CREATE TABLE switch_profile
(
  id SERIAL PRIMARY KEY,
  /*
   * Subscriber Id 
   * A subscriber can have many profiles
   * A profile can only belong to one subscriber
   */ 
  subscriber_id INTEGER references subscriber(id) NOT NULL,

  /*
   * Profile Name
   * example: 'brocade mlxe profile'
   */
  name VARCHAR(60) NOT NULL,

  ---- Datapath Capabilities -----------------------  
  /*
   * Openflow protocol version
   */
  ofp_version BYTEA(8)  NOT NULL,

  /*
   * datapath_id 
   * 
   */
   datapath_id BYTEA(64) NOT NULL,

  /*
	 * n_buffers
   */
   n_buffers BYTEA(32) NOT NULL,

  /*
   * n_tables
   * number of flowtable in the datapath
   */
   n_Tables BYTEA(8) NOT NULL
);
