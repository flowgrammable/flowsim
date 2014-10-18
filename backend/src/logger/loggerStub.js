(function(){

var bunyan = require('bunyan');

function Logger() {
}
exports.Logger = Logger;

Logger.prototype.addLog = function(){
  this.log = bunyan.createLogger({
    name: 'stub'
  });
  return this.log;
};

Logger.prototype.error = function(){

};

})();
