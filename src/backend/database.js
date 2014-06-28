
// This is intended to be for testing purposes only. The object
// returned by this module is a mock-database

module.exports = {
  subscribers: [
    {
      email: "jasson.casey@gmail.com",
      password: "iluvflowg",
      state: "",                        // CREATED | ACTIVE | RESET | CLOSED,
      token: ""                         // large random number
    }
  ],
  sessions: [
    {
      accessToken: 'asdfasdf',
      subscriberId: 2
    }
  ]
}

