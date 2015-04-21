( function(){

var request = require('request');
var redis = require('redis');

var name = 'redisclient';

function Redisclient(config){
	this.config = config[name];
  this.client = redis.createClient(this.config.port, this.config.host);
}

exports.Redisclient = Redisclient;
})();
