#!/usr/bin/env node

var program = require('commander');

program
  .version(process.env.SERVER_VERSION)
  .parse(process.argv);


