create table packet
(
   id SERIAL PRIMARY KEY,
   subscriber_id INTEGER references subscriber(id) NOT NULL,
   name VARCHAR(60),
   bytes INTEGER
);

