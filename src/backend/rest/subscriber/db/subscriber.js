var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
	model:{
    email: Seq.STRING,
    password: Seq.STRING,
    reg_date: Seq.DATE,
    reg_ip: Seq.STRING,
    verification_token: Seq.UUIDV4,
    status: Seq.STRING,
	},
  relations:{
		hasOne:"authtoken"
	}
}
