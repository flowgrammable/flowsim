var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
	model:{
    id: { 
      type: Seq.INTEGER, 
      allowNull: false, 
      primaryKey: true 
    },
    subscriber_id: { 
      type: Seq.INTEGER, 
      references: "subscriber",
      allowNull: false 
    },
    name: { 
      type: Seq.STRING, 
      allowNull: false 
    }
	},
	relations:{
		belongsTo: { relative: "subscriber", as: "Subscriber" }
	},
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'switch_profile'
	}
}
