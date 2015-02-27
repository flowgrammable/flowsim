# Flowsim UI #

## Developmnet ##

You can develop flowsim ui using LiveReload server configured with Grunt.
There are two options:

1. Developing UI with running backend REST API services
2. Developing UI standalone

### Developing Flowsim UI with Flowsim Back Server ###


Start backend server 

    npm start
  
  Back server will start listening on port 8080
  
Start front server in development mode 

    grunt serve:local

  Front LiveReload server will start listening on port 9000 and will proxy all API calls to backend server providing full capabilities.
  
### Developing  Flowsim UI without backend server ###

Start front server in development mode 

    grunt serve

  Front LiveReload server will start listening on port 9000.
  
  Prepare api/subscriper/login API service to enable login functionality.
  
    curl -X POST \
        -H "mock-method: POST" \
        -H "Content-type: application/json" \
        -d '{"value":{"x-access-token":"51e870c8-8520-43fd-b9a2-db6863b2fec6"}}' http://localhost:9000/mock/api/subscriber/login
        
Open a browser , navigate to http://localhost:9000/#/ click on login, provide any valid email address, and enter any fake password. 

And thats it.
  
### Mocking REST API Services ###

LiveReload server is configured to use mock-rest-request library. This library aloows for adding on the fly mock functionality to a server.

Purpose of these mock services is twofold:
1. To provide capability to run development server for UI and mock API responses during development of UI.
2. To allow developers to modify response from REST API on the fly while developing and testing UI.

How it works

You send a POST request to LiveReload webserver telling it that you want to mock a certain request. This POST request contains the mock data. After that, GET requests will return the mocked data.

It works with other methods besides GET and you can also mock status codes other than 200.

In order to mock an API you have to send POST request that starts with the path /mock, followed by the path to mock.

For example: 

Add a mock for API `user` DELETE

    curl -X POST \
        -H "mock-method: DELETE" \
        -H "mock-response: 403" \
        -H "Content-type: application/json" \
        -H "mock-header-Last-Modified: Tue, 15 Nov 1994 12:45:26 GMT" \
        -d '{"error": "Not authorized"}' http://localhost:9000/mock/api/user

Now send a request 

    curl -D - -X DELETE http://localhost:9000/api/user
    
    HTTP/1.1 403 Forbidden
    Content-Type: application/json
    last-modified: Tue, 15 Nov 1994 12:45:26 GMT
    Date: Wed, 18 Jun 2014 13:39:30 GMT
    Connection: keep-alive
    Transfer-Encoding: chunked
    
    {"error": "Not authorized"}



