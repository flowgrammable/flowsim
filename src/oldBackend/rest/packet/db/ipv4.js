var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:           { type: Seq.INTEGER, allowNull: false, primaryKey: true }, 
		packet_id:    { type: Seq.INTEGER, allowNull: false, references: "packet" }, 
    ipv4_dscp:    { type: Seq.BLOB, allowNull: true},
    ipv4_ecn:     { type: Seq.BLOB, allowNull: true},
    ipv4_proto:   { type: Seq.BLOB, allowNull: true},
    ipv4_src:     { type: Seq.BLOB, allowNull: false },
    ipv4_dst:     { type: Seq.BLOB, allowNull: false }
  },
  relations:{
    belongsTo: { relative: "packet", options: { as: "Packet" }},
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'ipv4'
	} 
}
