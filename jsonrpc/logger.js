var bunyan = require('bunyan');

function Logger(config){
  this.log = bunyan.createLogger({name: 'jsonrpc', streams:[]});
}

Logger.prototype.info = function(msg){
  this.log.info(msg);
}

Logger.prototype.error = function(msg){
  this.log.error(msg);
}

exports.Logger = Logger;
