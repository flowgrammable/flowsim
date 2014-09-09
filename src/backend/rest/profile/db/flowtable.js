var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model: {
    id:         { type: Seq.INTEGER, primaryKey: true, allowNull: false },
    profile_id: { type: Seq.INTEGER, references: "switch_profile", allowNull: false },
    flowtable_id: { type: Seq.BLOB, allowNull: false}
  },
  relations:{
    belongsTo: { relative: "switch_profile", options: { as: "switch_profile" }}
  },
  options: {
    timestamps: false,
    underscored: true,
    tableName: 'flowtable'
  }
}  
