
var sequelize = require('sequelize');

module.exports = {
  name: 'subscriber',
	table: {
    email: sequelize.STRING,
    password: sequelize.STRING,
    reg_date: sequelize.DATE,
    reg_ip: sequelize.STRING,
    verification_token: sequelize.UUIDV4,
    reset_token: sequelize.UUIDV4,
    status: sequelize.STRING
	},
  relations: {
    // hasMany: { relative: "switch_profile", options: { as: "Profiles" } },
		// hasOne:"session"
		hasMany: { relative: "switch_profile", options: { as: "Profile"}},
		hasMany: { relative: "packet", options: { as: "Packet" }}
	},
	options: {
		timestamps: false,
		underscored: true,
		tableName: 'subscriber'
	}
}

