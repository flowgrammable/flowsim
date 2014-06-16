## 1. Import Subscriber Module

      var mailer = require('./subscriber');
     

## 2. To get the list of subsribers:
Run the server code:

      node server.js 

HTTP GET request with the following path:*
     
      http://localhost:8000/subscribers
      
      Hostname should be the IP-Address of the system running 'server.js', in this case it is localhost
      
To use curl utility for making HTTP request, type the following in the terminal:
     
            curl --include \
            http://localhost:8000/subscribers
     

## 3. To register an account for a potential subscriber:
  ### 3.1. Register User
      
      #### Run the server code:
      
        node server.js 
      
      #### HTTP POST request with the following path:
      
        http://localhost:8000/subscribers
      
        * Hostname should be the IP-Address of the system running 'server.js', in this case it is localhost
        * The body of this post request should have three fields: email, password1, password2 
      
      #### To use curl utility for making HTTP request, type the following in the terminal:
      
        curl --include \
             --request POST \
             --header "Content-Type: application/json" \
             --data-binary '{ "email": "user3@user3.com", "password1": "my password", "password2":"my password" }' \
             http://localhost:8000/subscribers


  ### 3.2. Verify User E-mail 

      #### Run the server code:

        node server.js 

      #### HTTP GET request with the following path:

        http://localhost:8000/subscribers/verify/token

        * Hostname should be the IP-Address of the system running 'server.js', in this case it is localhost
        * Token should be valid token sent to the respective email used for registering user
      
      #### To use curl utility for making HTTP request, type the following in the terminal:
     
            curl --include \
            http://localhost:8000/subscribers/verify/110ec58a-a0f2-4ac4-8393-c866d813b8d1
            
        * Token used in the URL is a dummy token      
     
         


