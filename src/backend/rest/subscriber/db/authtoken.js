var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
	model:{
    token: Seq.UUIDV4,
	created_at: Seq.DATE,
    updated_at: Seq.DATE    
	},
	relations:{
		belongsTo:"subscriber"
	}
}
