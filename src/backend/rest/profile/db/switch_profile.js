module.exports = {
  model: {
    id:            { type: Seq.INTEGER, primaryKey: true/*, allowNull: false*/ },
    subscriber_id: { type: Seq.INTEGER, references: "subscriber"/*, allowNull: false*/ },
    name:          { type: Seq.STRING/*, allowNull: false*/ },
    
    // ------------------------- Datapath Capabilities -------------------------  
    ofp_version:   { type: Seq.BLOB('tiny')/*, allowNull: false*/ },
    datapath_id:   { type: Seq.BLOB('tiny')/*, allowNull: false*/ },
    n_buffers:     { type: Seq.BLOB('tiny')/*, allowNull: false*/ },
    n_Tables:      { type: Seq.BLOB('tiny')/*, allowNull: false*/ },
    ip_reassembly: { type: Seq.BOOLEAN/*, allowNull: false*/ },
    stp:           { type: Seq.BOOLEAN/*, allowNull: false*/ }, 
    port_blocked:  { type: Seq.BOOLEAN/*, allowNull: false*/ },
    // -------------------------------------------------------------------------

    // ------------------------- Datapath Description --------------------------
    mfr_description: { type: Seq.STRING/*, allowNull: false*/ },
    hw_description:  { type: Seq.STRING/*, allowNull: false*/ },
    sw_description:  { type: Seq.STRING/*, allowNull: false*/ },
    serial_num:      { type: Seq.STRING/*, allowNull: false*/ },
    dp_description:  { type: Seq.STRING/*, allowNull: false*/ },
    // -------------------------------------------------------------------------

    // ------------------------ Datapath Configuration -------------------------
    miss_send_len:             { type: Seq.INTEGER/*, allowNull: false*/ },
    frag_handling:             { type: Seq.ENUM('NORMAL', 'DROP', 'REASSEMBLE', 'MASK')/*, allowNull: false*/ },
    invalid_ttl_to_controller: { type: Seq.BOOLEAN/*, allowNull: false*/ },
    // -------------------------------------------------------------------------

  },
  relations: {
    belongsTo: { relative: "subscriber", options: { as: "Subscriber" } },
  },
  options: {
    timestamps: false,
    underscored: true,
    tableName: 'switch_profile'
  }
}
