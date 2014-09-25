#!/bin/sh

#Adjusting terminal window to spec reporter 
REPORTER = 'spec'

MOCHA=$(PWD)/node_modules/.bin/mocha

# looking for files present in "test" folder throughout the repo excluding "scratch" and "node_modules" folders
UNIT_TESTS=$(shell find -path "*/test/*.js" -not -path "*/node_modules/*" -a -not -path "*/*/rest*.js")


unit-test:
	@clear
	-$(MOCHA) -t 20000 -R $(REPORTER) $(UNIT_TESTS)

.PHONY: unit-test
