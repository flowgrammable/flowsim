
// This is intended to be for testing purposes only. The object
// returned by this module is a mock-database

module.exports = {
  subscribers: [
    {
      subscriberId: 1,
      name: "Jasson Casey",
      email: "jasson.casey@gmail.com",
      password: "iluvflowg"
    }
  ],
  sessions: [
    {
      sessionId: '123456',
      accessToken: 'asdfasdf',
      subscriberId: 2
    }
  ]
}

