
Flyway
======

  Flyway is the database migration tool that we are currently using. This tool
  performs a simplified version of version management and incremental updates to
  keep the database schema in sync with our evolving sql. Complete reference
  material can be found here: http://flywaydb.org/documentation/commandline/.

  Think of migrations as versioned sets of sql commands. Flyway will apply these
  versioned sets of commands to the target database and maintain a table in the
  database tracking the current application state. Migrations are mainly useful
  once we start releasing and have to deal with sane movement from the released
  datamodel and are new development/production datamodel.

  Migrate
  -------

    Execute the migrations present to the highest version.

    flyway migrate

  Clean
  -----

    Drop all tables associated with this set of migrations.

    flyway clean

  Info
  ----

    Display existing status of migrations from the perspective of the database.

    flyway info

