var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
	model:{
    name: Seq.STRING  
	},
	relations:{
		belongsTo:"subscriber"
	}
}
