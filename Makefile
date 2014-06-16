#!/bin/sh

#Adjusting terminal window to spec reporter 
REPORTER = 'spec'

MOCHA=node_modules/.bin/mocha
# flyway location
FLYWAY=3rdparty/flyway-3.0

# flyway jdbc location
FLYWAY_JAR="-jarDir=$(PWD)/$(FLYWAY)/jars"

# flyway database connection string
FLYWAY_URL='-url=jdbc:postgresql://localhost/flowsim'

# flyway migrations locations
FLYWAY_LOCATIONS="-locations=filesystem:$(PWD)/sql"

# flyway username/password
FLYWAY_USER='-user=flogdev'
FLYWAY_PASSWORD='-password=flogdev'

# general flyway configuration string
FLYWAY_CFG=$(FLYWAY_USER) $(FLYWAY_PASSWORD) $(FLYWAY_JAR) $(FLYWAY_URL) $(FLYWAY_LOCATIONS)

flyway=$(FLYWAY)/flyway $(FLYWAY_CFG)

# looking for files present in "test" folder throughout the repo excluding "scratch" and "node_modules" folders
TESTS=$(shell find -path "*/test/*.js" -not -path "*/node_modules/*" -a -not -path "*/scratch/*")

test:
	$(flyway) clean && $(flyway) migrate
	clear
	$(MOCHA) -t 4000 -R $(REPORTER) $(TESTS)

.PHONY: test
