(function(){

var ofPorts = {
  type: 'array',
  items: {  type: 'object', strict: true,
            properties: {
              id:      {type: 'number', error: 'invalidType'},
              hw_addr: {type: 'string', error: 'invalidType'},
              name:    {type: 'string', error: 'invalidType'}
             }
  }
};

var ofQueues = {
  type: 'array',
  items: { type: 'object', strict: true,
           properties: {
             id: {type: 'number', error: 'invalidType'},
             min_rate_supported: {type: 'number', error: 'invalidType'}
           }}
};

var fieldType = {
  type: 'object', strict: true,
  properties : {
    match:                {type: 'boolean', error: 'invalidType'},
    wildcard:             {type: 'boolean', error: 'invalidType'},
    mask:                 {type: 'boolean', error: 'invalidType'},
    // Instruction: Write setfield action
    write_setfield:       {type: 'boolean', error: 'invalidType'},
    write_setfield_miss:  {type: 'boolean', error: 'invalidType'},
    // Instruction: Apply setfield action
    apply_setfield:       {type: 'boolean', error: 'invalidType'},
    apply_setfield_miss:  {type: 'boolean', error: 'invalidType'}
  }
};

var ofTables = {
  type: 'array',
  items: { type: 'object', strict: true,
           properties: {
            // Capabilities for each table
            id: {type: 'number', error: 'invalidType'},
            name: {type: 'string', error: 'invalidType'},
            max_entries: {type: 'number', error: 'invalidType'},
            table_stats: {type: 'boolean', error: 'invalidType'},
            flow_stats: {type: 'boolean', error: 'invalidType'},
            miss_controller: {type: 'boolean', error: 'invalidType'},

            // Supported fields for each table
            inPort:     fieldType,
            inPhyPort:  fieldType,
            metadata:   fieldType,
            // Ethernet
            ethSrc:     fieldType,
            ethDst:     fieldType,
            ethType:    fieldType,
            // Vlan
            vid:        fieldType,
            vpcp:       fieldType,
            // ARP
            arpOpcode:  fieldType,
            arpSpa:     fieldType,
            arpTpa:     fieldType,
            arpSha:     fieldType,
            arpTha:     fieldType,
            // MPLS
            mplsLabel:  fieldType,
            mplsTc:     fieldType,
            mplsBos:    fieldType,
            // PBB
            pbbIsid:    fieldType,
            pbbUca:     fieldType,
            // GRE
            tunnelId:   fieldType,
            // IP
            ipDscp:     fieldType,
            ipEcn:      fieldType,
            ipProto:    fieldType,
            ipv4Src:    fieldType,
            ipv4Dst:    fieldType,
            ipv4Tos:    fieldType,
            ipv6Src:    fieldType,
            ipv6Dst:    fieldType,
            ipv6Flabel: fieldType,
            ipv6Ndtarget: fieldType,
            ipv6Ndsll:  fieldType,
            ipv6Ndtll:  fieldType,
            ipv6Exhdr:  fieldType,
            // ICMPv4
            icmpv4Type: fieldType,
            icmpv4Code: fieldType,
            // ICMPv6
            icmpv6Type: fieldType,
            icmpv6Code: fieldType,
            // Layer 4
            srcPort:    fieldType,
            dstPort:    fieldType
           }

  }
};

var profileSchema = {
  type: 'object', strict: true,
  properties: {
    name:         {type: 'string', error: 'invalidType'},
    ofp_version:  {type: 'number', eq: [0,1,2,3,4], error: 'invalidType'},
    datapath_id:  {type: 'number', error: 'invalidType'},
    n_buffers:    {type: 'number', error: 'invalidType'},
    n_tables:     {type: 'number', error: 'invalidType'},
    n_ports:      {type: 'number', error: 'invalidType'},
    mfr_desciption: {type: 'string', error: 'invalidType'},
    hw_description: {type: 'string', error: 'invalidType'},
    sw_description: {type: 'string', error: 'invalidType'},
    serial_num:    {type: 'string', error: 'invalidType'},
    dp_description: {type: 'string', error: 'invalidType'},
    ip_reassembly: {type: 'boolean', error: 'invalidType'},
    //virtual ports
    vp_local: {type: 'boolean', error: 'invalidType'},
    vp_normal: {type: 'boolean', error: 'invalidType'},
    vp_flood: {type: 'boolean', error: 'invalidType'},
    ports: ofPorts,         // list of ports
    queues: ofQueues,       // list of queues
    tables: ofTables        // list of tables

  }
};

exports.profileSchema = profileSchema;
})();
