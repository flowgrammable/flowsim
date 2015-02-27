GUI Test Overview 
-------------------
The Flowsim GUI is tested continuously during development to ensure 
specified functionality does not regress. The GUI is tested at the DOM
level. For more information on DOM refer to 
http://en.wikipedia.org/wiki/Document_Object_Model
GUI tests are specified by feature use case. For example 'Clicking the
logout button should return the user to the home screen'. In this case, on
a technical level, we are testing that DOM will be updated to display the 
home screen <div> once a user submits the logout <form>.

The framework used to execute these tests is Protractor. 
https://www.npmjs.com/package/protractor
The protractor framework executes tests by launching a browser and 
performing actions in the browser such as 'click', 'verify', 'type'.


Getting Started
---------------
Before you can begin testing you must complete all steps in the
doc/INSTALL.md instructions. To record and execute tests you will
need to install the following dependencies: 
- Selenium server 2.45.0
- Chrome browser
- Firefox browser
- Firefox selenium IDE plugin 2.8.0
- Firefox selenium builder 2.3

Test Suite Structure
--------------------
The test suite is composed of my individual tests for each page.
GUI tests are stored in the flowsim-ui/test/e2e directory. Each page in
flowsim has its own directory. 
ie Packet page tests are stored in flowsim-ui/test/e2e/packet folder

Running the test suite
----------------------
The GUI test suite is executed in your desktop browser. When the test
suite executes you will see the Chrome browser launch and begin running
through individual tests. To start the test suite run the following
command: ```grunt test:e2e```

Test results will be displayed once the test suite has finished executing.

Writing tests
-------------
Individual tests are recorded with the Firefox Selenium builder plugin. Lets
walk through writing the simple test case of logging into flowsim.

1. Write the test case as a story. 'GUI should display logout button
once a user has logged in'

2. Start a development instance of flowsim with the following command: 
```grunt serve```

3. Open up Firefox browser to localhost:9000

4. Launch the firefox selenium builder plugin by going to 
Tools -> Web developer -> Launch selenium builder. Select 'Selenium 2'

5. Click record

6. Click login button, enter credentials, and click login.

7. Verify the logout button is presented by clicking 'Record a verification', 
then click the logout button.

8. Click 'Stop recording'

9. Verify the test is running correctly by clicking 'Run -> Run test locally'

10. Once you are happy with the test go to 
'File -> Export -> Node.JS Protractor' and save the file to the 
flowsim/flowsim-ui/test/e2e folder
