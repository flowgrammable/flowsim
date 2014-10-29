'use strict';

function Datapath(id) {
  // Capabilities
  this.datapath_id   = id;
  this.n_buffers     = 1024;
  this.n_tables      = 256;
  this.ip_reassembly = true;

  // Descriptions
  this.mfr_description = '';
  this.hw_description  = '';
  this.sw_description  = '';
  this.serial_num      = '';
  this.dp_description  = '';
}

function Ports() {
  this.n_ports    = 48;
  this.port_stats = true;
  this.stp        = false;
  this.in_port    = true;
  this.table      = true;
  this.normal     = true;
  this.flood      = true;
  this.all        = true;
  this.controller = true;
  this.local      = true;
  this.any        = true;
  this.none       = true;
}

function Profile(name) {
  this.name = name;
}

function ProfileUI(obj) {
  if(obj === undefined) {
    this.dirty = true;
  } else {
    this.dirty = false;
  }
}

ProfileUI.prototype.toBase = function() {
  var result = new Profile();
  return result;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.profile
 * @description
 * # profile
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Profile', function(Subscriber) {

    function create(name) {
      return new Profile(name);
    }

    function createUI(obj) {
      return new ProfileUI(obj);
    }

    function setVersion(profile, version) {
      console.log('version: '+version);
    }

    return {
      create: create,
      createUI: createUI,
      setVersion: setVersion
    };

  });
