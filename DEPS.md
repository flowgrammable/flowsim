
  3) Initialize the postreSQL database

    initdb <name of database cluster>          -- initializes a new db cluster
    pg_ctl -D <name of database cluster> start -- starts the db process
    createdb <name of database>                -- creates a db      (flowsim)
    createuser <name of user>                  -- creates a db user (flogdev)
