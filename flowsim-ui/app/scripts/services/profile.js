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

function Profile() {
  this.datapath = new Datapath();
  this.ports = new Ports();
  this.groups = new Groups();
  this.meters = new Meters();
}

/**
 * @ngdoc service
 * @name flowsimUiApp.profile
 * @description
 * # profile
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Profile', function profile() {

    var init = false;
    var names = [];
    var profiles = {};

    return {
      create: function(name) {
        profiles[name] = {
          name: name
        };
        return profiles[name];
      },
      destroy: function(name) {
        if(name in profiles) {
          delete profiles[name];
        }
      },
      get: function(name) {
        return name in profiles ? profiles[name] : null;
      },
      getNames: function(callback) {
        if(!init) {
          // get teh list from server
          //names = result;
          names = [];
          init = true;
        }
        callback(null, names);
      },
      save: function(callback) {

      }
    };
  });
