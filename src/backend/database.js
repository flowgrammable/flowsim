
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

