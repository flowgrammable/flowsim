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

    function get(name, callback) {
      if(name in profiles) {
        callback(null, profiles[name]);
      } else {
        Subscriber.httpGet('/api/profile/' name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            profiles[name] = result;
            // attach
            callback(null, result);
          }
        });
      }
    }

    function getNames(callback) {
      if(Object.keys(profiles).length) {
        callback(null, Object.keys(profiles));
      } else {
        Subscriber.httpGet('/api/profile', {}, function(err, result) {
          callback(err, result);
        });
      }
    }

    function create(name) {
        profiles[name] = {};
        profiles.name.dirty = true;
        return profiles[name];
    }

    function destroy(name) {
      delete profiles[name];
      Subscriber.httpDelete('/api/packet/'+name, {}, function(err, result) {
        if(err) {
          console.log(err.details);
        } else {
        }
      });
    }

    function save() {
      _.each(profiles, function(value, key) {
        if(value.dirty) {
          Subscriber.httpUpdate('/api/profile/'+key, value,
                                function(err, result) {
            if(err) {
              console.log(err.details);
            } else {
              value.dirty = false;
            }
          });
        }
      });
    }

    return {
      get: get,
      getNames: getNames,
      create: create,
      destroy: destroy,
      save: save
    };
  });
