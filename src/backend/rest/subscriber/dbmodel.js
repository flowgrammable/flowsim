var orm = require('../../dbbs'),
    Seq = orm.Seq();

module.exports = {
	model:{
    email: Seq.STRING,
    password: Seq.STRING,
    regDate: Seq.DATE,
    regIp: Seq.STRING,
    verificationToken: Seq.UUIDV4,
    status: Seq.STRING,
	}
}
