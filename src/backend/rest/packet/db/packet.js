var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
	model:{
    name: Seq.STRING
	},
  relations:{
    belongsTo:"subscriber",
	},
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'packet'
	} 
}
