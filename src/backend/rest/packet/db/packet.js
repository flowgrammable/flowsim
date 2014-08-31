var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:            { type: Seq.INTEGER, allowNull: false, primaryKey: true },
    subscriber_id: { type: Seq.INTEGER, allowNull: false, references: "subscriber" },
    name:          { type: Seq.STRING, allowNull: false },
    bytes:         { type: Seq.INTEGER, allowNull: true }
  },
  relations:{
    belongsTo: { relative: "subscriber", options: { as: "Subscriber" } }
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'packet'
	} 
}
