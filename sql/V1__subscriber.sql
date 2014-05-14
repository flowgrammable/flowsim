
-- create an enumerated type for the account status
CREATE TYPE SUBSCRIBER_STATUS AS ENUM (
  'REGISTERED',   -- a sub has registered but not confirmed they own their email
  'VERIFIED'     -- a sub has confirmed they own their email
);

-- create the primary subscriber table
CREATE TABLE subscriber
(
  id SERIAL PRIMARY KEY,                          -- internal id uses for sub
  email VARCHAR(128) NOT NULL UNIQUE,             -- email owned by sub
  password CHAR(60) NOT NULL,                     -- hashed pwd of sub
  reg_date TIMESTAMP WITH TIME ZONE NOT NULL,     -- date/time of registration
  reg_ip INET NOT NULL,                           -- ip used for registration
  status SUBSCRIBER_STATUS NOT NULL,              -- current sub disposition
  status_date TIMESTAMP WITH TIME ZONE NOT NULL,  -- date of last change in disp
  reg_key CHAR(128) NOT NULL                       -- verification key
);

-- create an enumerated type for the session status
CREATE TYPE SESSION_STATUS AS ENUM (
  'ACTIVE',       -- a session is currently active
  'TIMEDOUT',     -- a session ended by timing out
  'LOGGEDOUT'     -- a session ended by explicit logout
);

-- create a session table
CREATE TABLE session
(
  id SERIAL PRIMARY KEY,                              -- internal sesison id
  sub_id INTEGER references subscriber(id) NOT NULL,  -- reference to sub
  key CHAR(128) NOT NULL UNIQUE,                       -- session key for API
  begin_time TIMESTAMP NOT NULL,                      -- date/time session began
  end_time TIMESTAMP NOT NULL,                        -- date/time session ended
  ip INET NOT NULL,                                   -- ip used for session
  status SESSION_STATUS NOT NULL                      -- current session status
);



-- create a profile
CREATE TABLE profile_v100          -- table for openflow switch version 1.0
(
  id SERIAL PRIMARY KEY,
  name CHAR(20) NOT NULL ,        -- profile name
  no_ports INTEGER NOT NULL,       -- switch no_ports
  table_size INTEGER NOT NULL,     -- table_size
  
  flow_stats BOOLEAN NOT NULL,     -- Switch capabilities from feature_res      
  table_stats BOOLEAN NOT NULL,
  port_stats BOOLEAN NOT NULL,
  stp BOOLEAN NOT NULL,
  reserved BOOLEAN NOT NULL, 
  ip_reasm BOOLEAN NOT NULL,
  queue_stats BOOLEAN NOT NULL,               
  arp_match_ip BOOLEAN NOT NULL,   -- arp match optional in 1.0

  output BOOLEAN NOT NULL,         -- Switch supported actions from feature_res
  set_vlan_vid BOOLEAN NOT NULL,
  set_vlan_pcp BOOLEAN NOT NULL,
  strip_vlan BOOLEAN NOT NULL,
  set_dl_src BOOLEAN NOT NULL,
  set_dl_dst BOOLEAN NOT NULL,
  set_nw_src BOOLEAN NOT NULL,
  set_nw_dst BOOLEAN NOT NULL,
  set_nw_tos BOOLEAN NOT NULL,
  set_tp_src BOOLEAN NOT NULL,
  set_tp_dst BOOLEAN NOT NULL,
  enqueue    BOOLEAN NOT NULL
   
);
  

