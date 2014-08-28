
// This is intended to be for testing purposes only. The object
// returned by this module is a mock-database

module.exports = {
  subscriber: [
    {
      id: 1,
      email:              'jasson.casey@gmail.com',
      // password is iluvflowg encrypted
      password:           '$2a$10$UE4Xn0wCQV4tQypIrRTo1.q/4en6shWn6myN8wHqpUn47qT9Nmd9G',
      reg_date:           new Date(),
      reg_ip:             '127.0.0.1',
      verification_token: 'c2e6de55-2030-41e0-aa48-6ce5d2314a67',
      status:             'CREATED'
    }
  ],
  session: [
    {
      subscriber_id: 1,
      key:           'f151d3c9-2452-41b2-a249-8b8cb2535097',
      timeout:       0
    }
  ],
  packet: [
    {
      id:            1,
      name:          'Packet123',
      subscriber_id: 1,
      bytes:         256
    }
  ],
  ethernet: [
    {
      id: ,
      packet_id: ,
      eth_src_mac: ,
      eth_dst_mac: ,
      eth_type:
    }
  ],
  VLAN: [
    {
      id: ,
      ethernet_id: ,
      eth_vlan_vid: ,
      eth_vlan_pcp: ,
      eth_type:
    }
  ],
  MPLS: [
    {
      id: ,
      ethernet_id: ,
      mpls_label: ,
      mpls_tc: ,
      mpls_bos_bit:
    }
  ],
  ARP: [
    {
      id: ,
      ethernet_id: ,
      arp_op: ,
      arp_sha: ,
      arp_spa: ,
      arp_tha: ,
      arp_tpa:
    }
  ],
  IPv4: [
    {
      id: ,
      ethernet_id: ,
      VLAN_id: ,
      MPLS_id: ,
      ipv4_dscp: ,
      ipv4_ecn: ,
      ipv4_proto: ,
      ipv4_src: ,
      ipv4_dst:
    }
  ],
  IPv6: [
    {
      id: ,
      ethernet_id: ,
      VLAN_id: ,
      MPLS_id: ,
      ipv6_dscp: ,
      ipv6_ecn: ,
      ipv6_proto: ,
      ipv6_src: ,
      ipv6_dst: ,
      ipv6_flabel: ,
      ipv6_exthdr:
    } 
  ],
  ICMPv4: [
    {
      id: ,
      ipv4_id: ,
      icmpv4_type: ,
      icmpv4_code:
    }
  ],
  ICMPv6: [
    {
      id: ,
      ipv6_id: ,
      icmpv6_type: ,
      icmpv6_code: ,
      icmpv6_nd_target: ,
      icmpv6_nd_sll: ,
      icmpv6_nd_tll:
    }  
  ],
  Layer4: [
    {
      id: ,
      ipv4_id: ,
      ipv6_id: ,
      src_port: ,
      dst_port:
    }
  ],

  switch_profile: [
    {
      id:            1,
      subscriber_id: 1,
      name:          'profile',
      ofp_version:   10
    }
  ],
  dp_caps: [
    {
      id:            1,
      profile_id:    1,
      vp_all:        true, 
      vp_controller: true, 
      vp_table:      true,
      vp_in_port:    true,
      vp_any:        true,
      vp_local:      true,
      vp_normal:     true,
      vp_flood:      true
    }
  ],
  ft_caps: [
    {
      id:          1, 
      dp_id:       1,
      table_id:    1,
      max_entries: 1
    }
  ]
}

