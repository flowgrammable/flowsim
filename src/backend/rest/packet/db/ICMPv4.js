var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:          { type: Seq.INTEGER, allowNull: false, primaryKey: true },  
    ipv4_id:   { type: Seq.INTEGER, allowNull: false, references: "ipv4" },
    icmpv4_type: { type: Seq.BLOB, allowNull: false }
    icmpv4_code: { type: Seq.BLOB, allowNull: false }
  },
  relations:{
    belongsTo: { relative: "ipv4", options: { as: "IPv4" } }
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'ICMPv4'
	} 
}
