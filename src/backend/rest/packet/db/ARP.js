var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:           { type: Seq.INTEGER, allowNull: false, primaryKey: true },  
    ethernet_id:  { type: Seq.INTEGER, allowNull: false, references: "ethernet" },
    arp_op:       { type: Seq.BLOB, allowNull: false }
    arp_sha:      { type: Seq.BLOB, allowNull: false }
    arp_spa:      { type: Seq.BLOB, allowNull: false }
    arp_tha:      { type: Seq.BLOB, allowNull: false }
    arp_tpa:      { type: Seq.BLOB, allowNull: false }
  },
  relations:{
    belongsTo: { relative: "ethernet", options: { as: "Ethernet" } }
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'ARP'
	} 
}
