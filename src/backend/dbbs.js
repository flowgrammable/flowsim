
// Is this the dummy datamodel interface ? -jc
//
// Why must this be a singleton? -jc
//
// Is the singleton stuff at teh bottom really necessary? Is there an existing
// nodejs or underscore mechanism for this pattern? -jc

var filesystem = require('fs');
var models = {};
var relationships = {};

var singleton = function singleton(){
  var Sequelize = require('sequelize');
  var sequelize = null;
  var modelsPath = "";
  this.setup = function() {

   sequelize = new Sequelize('flowsim', 'flogdev', 'flogdev', {
	  dialect: "postgres",
		logging: false,
	  port: 5432 
   });

   sequelize
	.authenticate()
	.complete(function(err){
	  if(err){ 
	  	console.log(err);
	  } else {
		console.log('Connection to db has been established successfully');
	  }
   });
   init();
  }

    this.model = function(name) {
		return models[name];
	}

	this.Seq = function() {
		return Sequelize;
	}

	function init() {
    var sess  = require('./rest/subscriber/db/session');
	var sub   = require('./rest/subscriber/db/subscriber');
	var pack   = require('./rest/packet/db/packet');
    var prof  = require('./rest/profile/db/switch_profile');
  //  var dpCaps  = require('./rest/profile/db/dp_caps');
    var flowtable  = require('./rest/profile/db/flowtable');
	var ethernet = require('./rest/packet/db/ethernet');
    var ipv4 = require('./rest/packet/db/ipv4');
    var options = {timestamps: false, underscored: true};

    models["session"] = sequelize.define("session", sess.model, sess.options);
    relationships["session"] = sess.relations;
	models["subscriber"] = sequelize.define("subscriber", sub.model, sub.options);
	relationships["subscriber"] = sub.relations; // none at the moment
    models["packet"] = sequelize.define("packet", pack.model, pack.options);
    relationships["packet"] = pack.relations;
	models["ethernet"] = sequelize.define("ethernet", ethernet.model, ethernet.options);
	relationships["ethernet"] = ethernet.relations;
	models["ipv4"] = sequelize.define("ipv4", ipv4.model, ipv4.options);
	relationships["ipv4"] = ipv4.relations;

    models["switch_profile"] = sequelize.define("switch_profile", prof.model, prof.options);
    relationships["switch_profile"] = prof.relations;
    models["flowtable"] = sequelize.define("flowtable", flowtable.model, flowtable.options);
    relationships["flowtable"] = flowtable.relations;
//    models["ft_caps"] = sequelize.define("ft_caps", ftCaps.model, ftCaps.options);
//    relationships["ft_caps"] = ftCaps.relations;

		for (var name in relationships) {
      var relation = relationships[name];
      for (var relName in relation) {
        var related = relation[relName];
        models[name][relName](models[related.relative], related.options)
      }
    }
	}
}

singleton.instance = null;

singleton.getInstance = function () {
	if(this.instance === null){
		this.instance = new singleton();
	}
	return this.instance;
}

module.exports = singleton.getInstance();
