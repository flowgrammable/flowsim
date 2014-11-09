'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.group
 * @description
 * # group
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Group', function group(Action, Utils) {

function Bucket(bucket, weight, watch_port, watch_group, actions) {
  if(bucket instanceof Bucket || 
     (typeof bucket === 'object' && bucket !== null)) {
    _.extend(this, bucket);
    this.actions = actions.clone();
  } else if(actions) {
    this.weight      = weight;
    this.watch_port  = watch_port;
    this.watch_group = watch_group;
    this.actions     = actions;
  } else {
    throw 'Bad Bucket('+bucket+', '+weight+', '+watch_port+', '+watch_group+', '+actions+')';
  }
}

Bucket.prototype.clone = function() {
  return new Bucket(this);
};

Bucket.TIPS = {
  weight: '',
  watch_port: '',
  watch_group: '',
  actions: ''
};

Bucket.TESTS = {
  weight: function() { return true; },
  watch_port: function() { return true; },
  watch_group: function() { return true; }
};

function Group(group, group_id, type) {
  if(group instanceof Group || (typeof group === 'object' && group !== null)) {
  } else if(typeof group_id === 'number' && type) {
    this.group_id = group_id;
    this.type     = type;
  } else {
    throw 'Bad Group('+group+', '+group_id+', '+type;
  }
}

Group.prototype.clone = function() {
  return new Group(this);
};

Group.TIPS = {
  group_id: '',
  type: ''
};

Group.TESTS = {
};

Group.Types = {
  ALL: 'all',
  SELECT: 'select',
  INDIRECT: 'indirect',
  FASTFAILOVER: 'fast-failover'
};

return {
  Group: Group
};

});

