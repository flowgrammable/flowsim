'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.tables
 * @description
 * # tables
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Tables', function(fgConstraints, ETHERNET) {

var defaultMaxEntries = 1024;
var defaultTableStats = true;
var defaultFlowStats  = true;

var Match = {};

Match.Capabilities = function(match) {
}

var Instruction = {};

Instruction.Capabilities = function(ins) {
}

var Miss = {};

Miss.Capabilities = function(miss) {
}

var Table = {};

Table.TIPS = {
};

Table.TESTS = {
};

Table.Capabilities = function(table) {
  if(table) {
    if(table instanceof Table.Capabilities) {
      // copy constructor
      this.table_id    = table.table_id;
      this.name        = table.name;
      this.max_entries = table.max_entries;
      this.table_stats = table.table_stats;
      this.flow_stats  = table.flow_stats;
      this.match       = new Match.Capabilities(table.match);
      this.instruction = new Instruction.Capabilities(table.instruction);
      this.miss        = new Miss.Capabilities(table.miss);
    } else if(typeof table === 'number') {
      this.table_id    = table;
      this.name        = 'table' + this.table_id;
      this.max_entries = defaultMaxEntries;
      this.table_stats = defaultTableStats;
      this.flow_stats  = defaultFlowStats;
      this.match       = new Match.Capabilities();
      this.instruction = new Instruction.Capabilities();
      this.miss        = new Miss.Capabilities();
    } else {
      // JSON constructor
      _.extend(this, tables);
      this.match       = new Match.Capabilities(table.match);
      this.instruction = new Instruction.Capabilities(table.instruction);
      this.miss        = new Miss.Capabilities(table.miss);
    }
  }
}

function Configuration(tables) {
  if(tables) {
    if(tables instanceof Capabilities) {
      // capability constructor
    } else if(tables instanceof Configuration) {
      // JSON constructor
    }
  }
}

function Configuration(tables) {
  if(tables) {
    if(tables instanceof Capabilities) {
      // capability constructor
    } else if(tables instanceof Configuration) {
      // JSON constructor
    }
  }
}

function Configuration(tables) {
  if(tables) {
    if(tables instanceof Capabilities) {
      // capability constructor
    } else if(tables instanceof Configuration) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, tables);
    }
  } else {
    // default constructor
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};

});
