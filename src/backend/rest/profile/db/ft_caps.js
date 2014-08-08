var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:          { type: Seq.INTEGER, allowNull: false, primaryKey: true },
    dp_id:       { type: Seq.INTEGER, allowNull: false, references: "dp_caps", unique: true },
    table_id:    { type: Seq.INTEGER },
    max_entries: { type: Seq.INTEGER }
  },
  relations:{
    belongsTo: { relative: "dp_caps", options: { as: "DpCaps" } }
  },
  options:{
    timestamps: false,
    underscored: true,
    tableName: 'ft_caps'
  }
}
