
function Methods() {
  this.listDB         = 0;
  this.getSchema      = 0;
  this.transact       = 0;
  this.cancel         = 0;
  this.monitor        = 0;
  this.update         = 0;
  this.monitor_cancel = 0;
  this.lock           = 0;
  this.steal          = 0;
  this.unlock         = 0;
  this.locked         = 0;
  this.stolen         = 0;
  this.echo           = 0;
  this.unknown        = 0;
}

function Peg() {
  // Summary counts
  this.requests      = 0;
  this.responses     = 0;
  this.notifications = 0;
  // Method counts
  this.reqs = new Methods();
  this.ress = new Methods();
}

function Stats() {
  this.rcvPegs = new Peg();
  this.sndPegs = new Peg();
}

Stats.prototype.rcvReq = function() {
  this.rcvPegs.requests++;
  return this.rcvPegs.reqs;
};

Stats.prototype.snd = function(name) {
  this.sndPegs.
};
