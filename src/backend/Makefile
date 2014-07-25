#!/bin/sh

#Adjusting terminal window to spec reporter 
REPORTER = 'spec'

MOCHA=$(PWD)/node_modules/.bin/mocha
# flyway location
FLYWAY= ../../3rdparty/flyway-3.0

# flyway jdbc location
FLYWAY_JAR="-jarDir=$(FLYWAY)/jars"

# flyway database connection string
FLYWAY_URL='-url=jdbc:postgresql://localhost/flowsim'

# flyway migrations locations
FLYWAY_LOCATIONS="-locations=filesystem:sql"

# flyway username/password
FLYWAY_USER='-user=flogdev'
FLYWAY_PASSWORD='-password=flogdev'

# general flyway configuration string
FLYWAY_CFG=$(FLYWAY_USER) $(FLYWAY_PASSWORD) $(FLYWAY_JAR) $(FLYWAY_URL) $(FLYWAY_LOCATIONS)

flyway=$(FLYWAY)/flyway $(FLYWAY_CFG)

server='$(PWD)/index.js'

# looking for files present in "test" folder throughout the repo excluding "scratch" and "node_modules" folders
UNIT_TESTS=$(shell find -path "*/test/*.js" -not -path "*/node_modules/*" -a -not -path "*/*/rest*.js")

# looking for files present in "test" folder throughout the repo excluding "scratch" and "node_modules" folders
SYSTEM_TESTS=$(shell find -path "*/test/rest*.js" -not -path "*/node_modules/*")

unit-test:
	$(flyway) clean && $(flyway) migrate
	clear
	$(MOCHA) -t 20000 -R $(REPORTER) $(UNIT_TESTS)

system-test:
	$(flyway) clean && $(flyway) migrate
	$(server) -t & done 
	sleep 0.1
	$(MOCHA) -t 40000 -R $(REPORTER) $(SYSTEM_TESTS)

.PHONY: unit-test, system-test
