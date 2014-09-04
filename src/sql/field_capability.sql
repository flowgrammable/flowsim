CREATE TYPE field AS ENUM
(
	'ETH_DST',
	'ETH_SRC',
	'ETH_TYPE'
);

--Field Capabilities---------------------------------------------------------------
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
);
