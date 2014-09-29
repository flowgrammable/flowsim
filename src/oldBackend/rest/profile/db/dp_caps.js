var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:            { type: Seq.INTEGER, allowNull: false, primaryKey: true },
    profile_id:    { type: Seq.INTEGER, references: "switch_profile", allowNull: false, unique: true },
    vp_all:        { type: Seq.BOOLEAN }, 
    vp_controller: { type: Seq.BOOLEAN },
    vp_table:      { type: Seq.BOOLEAN },
    vp_in_port:    { type: Seq.BOOLEAN },
    vp_any:        { type: Seq.BOOLEAN },
    vp_local:      { type: Seq.BOOLEAN },
    vp_normal:     { type: Seq.BOOLEAN },
    vp_flood:      { type: Seq.BOOLEAN }
  },
  relations:{
    belongsTo: { relative: "switch_profile", options: { as: "Profile" } },
    hasOne:    { relative: "ft_caps", options: { as: "FtCaps", foreignKey: "dp_id" } }
  },
  options:{
    timestamps: false,
    underscored: true,
    tableName: 'dp_caps'
  }
}
