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

    var options = {timestamps: false, underscored: true};

    models["session"] = sequelize.define("session", sess.model, options);
    relationships["session"] = sess.relations;
		models["subscriber"] = sequelize.define("subscriber", sub.model, options);
		relationships["subscriber"] = sub.relations; // none at the moment

		for(var name in relationships){
      var relation = relationships[name];
      for(var relName in relation){
        var related = relation[relName];
        models[name][relName](models[related]);
        // console.log(models[name][relName](models[related]));
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
