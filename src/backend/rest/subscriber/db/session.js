var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
	model:{
    session_id: Seq.UUIDV4,
	  begin_time: Seq.DATE,
    end_time: Seq.DATE,
    ip: Seq.STRING,
    status: Seq.STRING    
	},
	relations:{
		belongsTo:"subscriber"
	}
}
