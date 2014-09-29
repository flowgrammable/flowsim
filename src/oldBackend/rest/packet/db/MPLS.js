var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:           { type: Seq.INTEGER, allowNull: false, primaryKey: true },  
    ethernet_id:  { type: Seq.INTEGER, allowNull: false, references: "ethernet" },
    mpls_label:   { type: Seq.BLOB, allowNull: false }
    mpls_tc:      { type: Seq.BLOB, allowNull: false }
    mpls_bos_bit: { type: Seq.BLOB, allowNull: false }
  },
  relations:{
    belongsTo: { relative: "ethernet", options: { as: "Ethernet" } }
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'MPLS'
	} 
}
