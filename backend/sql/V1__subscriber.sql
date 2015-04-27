-- create an enumerated type for the account status CREATE TYPE SUBSCRIBERS_STATUS AS ENUM ( 'CREATED',  -- registered but not verified, logins should not be possible
  'ACTIVE',   -- verified and can actively login
  'RESET',    -- password reset, no logins possible only pwd reset procedure
  'CLOSED'    -- closed, no functionality is supported against this state
);

-- create the primary subscriber table
CREATE TABLE subscriber
(
  id SERIAL PRIMARY KEY,                       -- internal id uses for sub
  email VARCHAR(128) NOT NULL UNIQUE,          -- email owned by sub
  password VARCHAR(60) NOT NULL,               -- hashed pwd of sub
  reg_date TIMESTAMP WITH TIME ZONE NOT NULL,  -- date/time of registration
  reg_ip INET NOT NULL,                        -- ip used for registration
  verification_token CHAR(36) NOT NULL UNIQUE, -- verification token
  status SUBSCRIBERS_STATUS NOT NULL           -- current sub disposition
);

CREATE TABLE subprofile
(
  id SERIAL PRIMARY KEY,
  subscriber_id INTEGER references subscriber(id) ON DELETE CASCADE,
  name VARCHAR(128),
  website VARCHAR(128),
  company VARCHAR(128),
  geography VARCHAR(128)
);

CREATE TYPE ROLE_TYPE AS ENUM (
  'ADMIN',
  'MEMBER'
);

CREATE TABLE organization
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL UNIQUE,
  reg_date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE organization_member 
(
  id SERIAL PRIMARY KEY,
  organization_id INTEGER references organization(id),
  member_id INTEGER references subscriber(id),
  role ROLE_TYPE NOT NULL
); 

CREATE TABLE team
( 
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL, 
  org INTEGER references organization(id) NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL,
  unique(name, org)
);

CREATE TABLE team_member
(
  id INTEGER references team(id) NOT NULL, 
  member INTEGER references subscriber(id) NOT NULL,
  role ROLE_TYPE NOT NULL
);

CREATE TYPE MAILER_STATUS AS ENUM (
  'SUBSCRIBED',
  'UNSUBSCRIBE'
);

CREATE TABLE mailinglist 
(
  id SERIAL PRIMARY KEY , -- internal mailer id
  email varchar(128) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL
);
  
-- create a session table
CREATE TABLE session
(
  id SERIAL PRIMARY KEY,                            -- internal sesison id
  subscriber_id INTEGER references subscriber(id) ON DELETE CASCADE, -- reference to sub 
  key CHAR(36) NOT NULL UNIQUE,                     -- session key for API 
  timeout TIMESTAMP WITH TIME ZONE NOT NULL         -- date/time for session to end
  -- ip INET NOT NULL                               -- ip used for session
);

-- create the primary packet table
CREATE TABLE packet
(
  id SERIAL PRIMARY KEY,                         -- internal id uses for sub
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- reference to sub
  name VARCHAR(60) NOT NULL,                                -- packet name
  packet JSON NOT NULL,                                     -- packet
  unique(subscriber_id, name)                             -- name unique to sub
);

-- create the primary profile table
CREATE TABLE profile
(
  id SERIAL PRIMARY KEY,                        -- internal id uses for sub
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- ref to sub
  name VARCHAR(60) NOT NULL,                                -- profile name
  profile JSON NOT NULL,                                    -- profile
  unique(subscriber_id, name)                              -- name unique to sub
);

-- create the primary switch table
CREATE TABLE switch
(
  id SERIAL PRIMARY KEY,                        -- internal id uses for sub
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- ref to sub
  name VARCHAR(60) NOT NULL,                                -- switch name
  _switch JSON NOT NULL,                                    -- switch
  unique(subscriber_id, name)                              -- name unique to sub
);

-- create the primary trace table
CREATE TABLE trace
(
  id SERIAL PRIMARY KEY,                        -- internal id uses for sub
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- ref to sub
  name VARCHAR(60) NOT NULL,                                -- trace name
  trace JSON NOT NULL,                                    -- trace
  unique(subscriber_id, name)                              -- name unique to sub
);
