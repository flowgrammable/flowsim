var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:       { type: Seq.INTEGER, allowNull: false, primaryKey: true },  
    ipv4_id:  { type: Seq.INTEGER, allowNull: false, references: "ipv4" },
    ipv6_id:  { type: Seq.INTEGER, allowNull: false, references: "ipv6" },
    src_port: { type: Seq.BLOB, allowNull: false }
    dst_port: { type: Seq.BLOB, allowNull: false }
  },
  relations:{
    belongsTo: { relative: "ipv4", options: { as: "IPv4" } }
    belongsTo: { relative: "ipv6", options: { as: "IPv6" } }
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'Layer4'
	} 
}
