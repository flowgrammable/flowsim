
// This is intended to be for testing purposes only. The object
// returned by this module is a mock-database

//var Sequelize = require('sequelize');
/*var sequelize = new Sequelize('flowsim', 'flogdev', 'flogdev', {
	dialect: "postgres",
	port: 5432
  });

sequelize
	.authenticate()
	.complete(function(err){
		if(err){ console.log(err);
	} else {
		console.log('Connection to db has been established successfully');
	}
});
*/
//var subscriber = require('./rest/subscriber/dbdef')(sequelize);
//sequelize.subscriber = subscriber;

/*var profile = sequelize.define('Profile', {
			name: Sequelize.STRING
		}, {tableName: 'profile'});
*/
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
				if(err){ console.log(err);
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
		var sub = require('./rest/subscriber/dbmodel');
    var modelName = "subscriber";
    var options =  {timestamps: false}
		models[modelName] = sequelize.define("subscriber", sub.model, options);
/*
		if("relations" in sub){
			relationships[modelName] = sub.relations;
		}
*/
		//console.log(models);
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
