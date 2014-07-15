var orm = require('../dbbs'),
    Seq = orm.Seq();

module.exports = {
	model:{
    key: Seq.STRING,
	  begin_time: Seq.DATE,
    end_time: Seq.DATE,
    ip: Seq.STRING,
    status: Seq.STRING    
	},
	relations:{
		belongsTo:"subscriber"
	}
}
