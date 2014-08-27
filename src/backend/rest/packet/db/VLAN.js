var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:           { type: Seq.INTEGER, allowNull: false, primaryKey: true },  
    ethernet_id:  { type: Seq.INTEGER, allowNull: false, references: "ethernet" },
    eth_vlan_vid: { type: Seq.BLOB, allowNull: false }
    eth_vlan_pcp: { type: Seq.BLOB, allowNull: false }
    eth_type:     { type: Seq.BLOB, allowNull: false }
  },
  relations:{
    belongsTo: { relative: "ethernet", options: { as: "Ethernet" } }
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'VLAN'
	} 
}
