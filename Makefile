#!/bin/bash
MOCHA=node_modules/.bin/mocha
#TESTS=$(shell find -path "*/test/*.js" -not -path "*node_modules/*")
TESTS=$(shell find -path "*/test/*.js" -not -path "*/node_modules/*" -a -not -path "*/scratch/*")

test:
	$(MOCHA) -R spec $(TESTS)

.PHONY: test
