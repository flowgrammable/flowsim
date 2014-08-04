
-- create an enumerated type for the account status
CREATE TYPE SUBSCRIBERS_STATUS AS ENUM (
  'CREATED',  -- a sub has been registered but not verified, logins should not be possible
  'ACTIVE',   -- a sub has verified and can actively login
  'RESET',    -- a sub has had their password reset, no logins possible only pwd reset procedure
  'CLOSED'    -- a sub has been closed, no functionality is supported against this state
);

-- create the primary subscribers table
CREATE TABLE subscribers
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

CREATE TABLE switch_profiles
(
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER references subscribers(id) NOT NULL,
  name CHAR(60) NOT NULL
);

CREATE TABLE dp_caps
(
	id SERIAL PRIMARY KEY,
  profile_id INTEGER references switch_profile(id) NOT NULL,
  -- Virual Ports
	vp_all BOOLEAN, 
  vp_controller BOOLEAN, 
  vp_table BOOLEAN,
  vp_in_port BOOLEAN,
  vp_any BOOLEAN,
  vp_local BOOLEAN,
  vp_normal BOOLEAN,
  vp_flood BOOLEAN
);

CREATE TABLE ft_caps
(
	id SERIAL PRIMARY KEY,
	dp_id INTEGER references dp_caps(id) NOT NULL,
  table_id INTEGER,
  max_entries INTEGER
);

CREATE TABLE match_caps
(
  id SERIAL PRIMARY KEY,
  ft_id INTEGER references ft_caps(id) NOT NULL,
  OFPXMT_OFB_IN_PORT BOOLEAN,
  OFPXMT_OFB_IN_PHY_PORT BOOLEAN,
  OFPXMT_OFB_ETH_DST BOOLEAN,
  OFPXMT_OFB_ETH_SRC BOOLEAN,
  OFPXMT_OFB_ETH_TYPE BOOLEAN
);

CREATE TABLE instruction_caps
(
	id SERIAL PRIMARY KEY,
  ft_id INTEGER references ft_caps(id) NOT NULL,
  OFPIT_APPLY_ACTIONS BOOLEAN
);

CREATE TABLE action_caps
(
	id SERIAL PRIMARY KEY,
  ft_id INTEGER references ft_caps(id) NOT NULL,
  OFPAT_OUTPUT BOOLEAN,
  OFPAT_SET_FIELD_ETH_DST BOOLEAN,
  OFPAT_SET_FIELD_ETH_SRC BOOLEAN
);

-- create a session table
CREATE TABLE sessions
(
  id SERIAL PRIMARY KEY,                              -- internal sesison id
  subscriber_id INTEGER references subscribers(id) NOT NULL,   -- reference to sub
  key CHAR(36) NOT NULL UNIQUE,                       -- session key for API
  -- begin_time TIMESTAMP WITH TIME ZONE NOT NULL,       -- date/time session began
  timeout BIGINT /*NOT NULL,*/     -- date/time for session to end
  -- ip INET NOT NULL                                    -- ip used for session
);

