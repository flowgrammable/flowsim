var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:          { type: Seq.INTEGER, allowNull: false, primaryKey: true },  
    packet_id:   { type: Seq.INTEGER, allowNull: false, references: "packet" },
    eth_src_mac: { type: Seq.BLOB, allowNull: false }
    eth_dst_mac: { type: Seq.BLOB, allowNull: false }
    eth_type:    { type: Seq.BLOB, allowNull: false }
  },
  relations:{
    belongsTo: { relative: "packet", options: { as: "Packet" } }
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'ethernet'
	} 
}
