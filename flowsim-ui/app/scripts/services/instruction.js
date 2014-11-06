'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.instruction
 * @description
 * # instruction
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Instruction', function(Action) {

function Apply(actions) {
  this.actions = actions;
}

Apply.prototype.execute = function(dp, ctx) {
  _.each(this.actions, function(action) {
    action.execute(dp, ctx);
  });
};

function Clear() {}

Clear.prototype.execute = function(dp, ctx) {
  ctx.actionSet.clear();
};

function Write(actions) {
  this.actions = actions;
}

Write.prototype.execute = function(dp, ctx) {
  ctx.actionSet.concat(this.actions);
};

function Metadata(metadata) {
  this._metadata = metadata;
}

Metadata.prototype.value = function(metadata) {
  if(metadata) {
    this._metadata = new Metadata(metadata);
  } else {
    return this._metadata;
  }
};

Metadata.prototype.execute = function(dp, ctx) {
  ctx.metadata(this._metadata);
};

function Meter(meter_id) {
  this.meter_id = meter_id;
}

Meter.prototype.value = function(meter_id) {
  if(meter_id) {
    this.meter_id = meter_id;
  } else {
    return this.meter_id;
  }
};

Meter.prototype.execute = function(dp, ctx) {
  // meter the flow
};

function Goto(table_id) {
  this.table_id = table_id;
}

Goto.prototype.value = function(table_id) {
  if(table_id) {
    this.table_id = table_id;
  } else {
    return this.table_id;
  }
};

Goto.prototype.execute = function(dp, ctx) {
  ctx.table_id = this.table_id;
};

function Set() {
  this._apply = Action.List();
  this._write = Action.Set();
}

Set.prototype.apply = function(apply) {
  if(apply) {
    this._apply = new Apply(apply);
  } else {
    return this._apply;
  }
};

Set.prototype.write = function(write) {
  if(write) {
    this._write = new Write(write);
  } else {
    return this._write;
  }
};

Set.prototype.metadata = function(metadata) {
  if(metadata) {
    this._metadata = new Metadata(metadata);
  } else {
    return this._metadata;
  }
};

Set.prototype.meter = function(meter) {
  if(meter) {
    this._meter = new Meter(meter);
  } else {
    return this._meter;
  }
};

Set.prototype.jump = function(jump) {
  if(jump) {
    this._jump = new Goto(jump);
  } else {
    return this._jump;
  }
};

Set.prototype.execute = function(dp, ctx) {
  if(this.meter) {
    this.meter.execute(dp, ctx);
  }
  this.apply.execute(dp, ctx);
  if(this.ins.clear) {
    ctx.actionSet.clear();
  }
  this.write.execute(dp, ctx);
  if(this.metadata) {
    this.metadata.execute(dp, ctx);
  }
  if(this.jump) {
    this.jump.execute(dp, ctx);
  }
};

return {
  Apply: Apply,
  Write: Write,
  Metadata: Metadata,
  Meter: Meter,
  Goto: Goto,
  Set: Set
};

});
