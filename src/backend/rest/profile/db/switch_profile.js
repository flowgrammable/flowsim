var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model: {
    id:            { type: Seq.INTEGER, primaryKey: true/*, allowNull: false*/ },
    subscriber_id: { type: Seq.INTEGER, references: "subscriber"/*, allowNull: false*/ },
    name:          { type: Seq.STRING/*, allowNull: false*/ },
    
    // ------------------------ Datapath Capabilities -------------------------  
    ofp_version:   { type: Seq.INTEGER/*, allowNull: false*/ },
    datapath_id:   { type: Seq.STRING(8)/*, allowNull: false*/ },
    n_buffers:     { type: Seq.INTEGER/*, allowNull: false*/ },
    n_tables:      { type: Seq.INTEGER/*, allowNull: false*/ },
    n_ports:       { type: Seq.INTEGER/*, allowNull: false*/ },
    ip_reassembly: { type: Seq.BOOLEAN/*, allowNull: false*/ },
    stp:           { type: Seq.BOOLEAN/*, allowNull: false*/ }, 
    port_blocked:  { type: Seq.BOOLEAN/*, allowNull: false*/ },
    // ------------------------------------------------------------------------

    // ------------------------- Datapath Description -------------------------
    mfr_description: { type: Seq.STRING/*, allowNull: false*/ },
    hw_description:  { type: Seq.STRING/*, allowNull: false*/ },
    sw_description:  { type: Seq.STRING/*, allowNull: false*/ },
    serial_num:      { type: Seq.STRING/*, allowNull: false*/ },
    dp_description:  { type: Seq.STRING/*, allowNull: false*/ },
    // ------------------------------------------------------------------------

    // ------------------------ Datapath Configuration ------------------------
    miss_send_len:   { type: Seq.INTEGER/*, allowNull: false*/ },
    frag_handling:   { type: Seq.ENUM('NORMAL', 'DROP', 'REASSEMBLE', 'MASK') },
    invalid_ttl_to_controller: { type: Seq.BOOLEAN },
    // ------------------------------------------------------------------------

    // -------------------------- Ports Capabilities --------------------------
    vp_all:        { type: Seq.BOOLEAN/*, allowNull: false*/ }, 
    vp_controller: { type: Seq.BOOLEAN/*, allowNull: false*/ }, 
    vp_table:      { type: Seq.BOOLEAN/*, allowNull: false*/ },
    vp_in_port:    { type: Seq.BOOLEAN/*, allowNull: false*/ },
    vp_any:        { type: Seq.BOOLEAN/*, allowNull: false*/ },
    vp_local:      { type: Seq.BOOLEAN/*, allowNull: false*/ },
    vp_normal:     { type: Seq.BOOLEAN/*, allowNull: false*/ },
    vp_flood:      { type: Seq.BOOLEAN/*, allowNull: false*/ },
    // ------------------------------------------------------------------------

    // ----------------------- Statistics Capabilities ------------------------
    flow_stats:  { type: Seq.BOOLEAN/*, allowNull: false*/ },
    table_stats: { type: Seq.BOOLEAN/*, allowNull: false*/ },
    port_stats:  { type: Seq.BOOLEAN/*, allowNull: false*/ },
    group_stats: { type: Seq.BOOLEAN/*, allowNull: false*/ },
    queue_stats: { type: Seq.BOOLEAN/*, allowNull: false*/ },
    // ------------------------------------------------------------------------
  },
  relations: {
   // belongsTo: { relative: "subscriber", options: { as: "Subscriber" } },
    hasMany:   { relative: "flowtable", options: { as: "Flowtable", foreignKey: "profile_id" }}
  },
  options: {
    timestamps: false,
    underscored: true,
    tableName: 'switch_profile'
  }
}
