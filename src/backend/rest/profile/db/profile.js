var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
	model:{
    id:            { type: Seq.INTEGER, allowNull: false, primaryKey: true },
    subscriber_id: { type: Seq.INTEGER, allowNull: false, references: "subscriber" },
    name:          { type: Seq.STRING, allowNull: false },
    ofp_version:   { type: Seq.INTEGER, allowNull: false }
	},
	relations:{
		belongsTo: { relative: "subscriber", options: { as: "Subscriber" } },
    hasOne:    { relative: "dp_caps", options: { as: "DpCaps", foreignKey: "profile_id" } }
	},
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'switch_profile'
	}
}
