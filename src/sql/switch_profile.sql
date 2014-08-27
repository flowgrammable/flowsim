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
  ofp_version BYTEA(32)  NOT NULL,

  /*
   * datapath_id 
   * 
   */
  name VARCHAR(60) NOT NULL
);
