
CREATE DATABASE flowsim;

\c flowsim;

CREATE TABLE subscriber
(
  subscriber_id INTEGER PRIMARY_KEY
  email VARCHAR(128) NOT NULL UNIQUE,
  password VARCHAR(32) NOT NULL
);

INSERT INTO subscriber VALUES
  ('roger@rabbit.com', 'toons' );

INSERT INTO subscriber VALUES
  ('adolf@germany.gov', 'heil' );

