
-- create an enumerated type for the account status
CREATE TYPE SUBSCRIBERS_STATUS AS ENUM (
  'CREATED',  -- registered but not verified, logins should not be possible
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

-- create a session table
CREATE TABLE session
(
  id SERIAL PRIMARY KEY,                            -- internal sesison id
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- reference to sub
  key CHAR(36) NOT NULL UNIQUE,                     -- session key for API
  timeout TIMESTAMP WITH TIME ZONE NOT NULL         -- date/time for session to end
  -- ip INET NOT NULL                               -- ip used for session
);

