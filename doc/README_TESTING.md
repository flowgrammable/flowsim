##TEST RUNNER
==================
###How to run unit test runner

Unit test runner runs all the test files except the rest tests on server.

  1. Locate the Makefile
  2. Run the unit test runner as follows in that Makefile directory
    
      `make unit-test`

###How to run system test runner

System test runner runs all the rest tests on the server files except the unit tests.

  1. Locate the Makefile
  2. Run the system test runner as follows in that Makefile directory
    
      `make system-test`

###MOCHA TEST FRAMEWORK

  It is a feature-rich JS test framework running on node.js and the browser, making asynchronous testing simple and fun.

+ **describe()**
    * commonly known as test suites, which contains test cases
    * It is used for grouping test cases and we can have groups within groups
+ **it()**
    * This is used to write a test case
+ **before(), beforeEach(), after(), afterEach()**
    * All 'hooks' may be sync or async as well, behaving much like a regular test-case.
    * They are hooks to run before/after first/each it() or describe(), which means, `before()` is run before first it()/describe()
+ **before()**
    * Run once before the first test-case/test-suite
+ **beforeEach()**
    * Run once before each test-case/test-suite
+ **after()**
    * Run once before first test-case/test-suite
+ **afterEach()**
    * Run once after each test-case/test-suite

###HOW TO RUN TESTS

* To run mocha tests, just add all the mocha javascript test files in a folder called "test"
* By default mocha will use the pattern './test/*.js' if no parameter is given to it.
* From the root directory of the project, run "make unit-test" to execute that Makefile, which runs mocha tests on all the files present in the test folder except the rest test files.

###Example Code

####Testing synchronous code
When testing synchronous code, omit the callback and Mocha will automatically continue on to the next test
  
    var assert = require('assert')
    
    describe('Array', function(){
      describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
          assert.equal([1,2,3].indexOf(5),-1);
          assert.equal([1,2,3].indexOf(0),-1);
        })
      })
    })

####To run this test: 

    mocha -R spec test.js

####Testing Asynchronous code
Simply invoke the callback when your test is complete. By adding a callback (usually named done) to it() Mocha will know that it should wait for completion.

    var assert = require("assert");
    var fs = require('fs');  
    
    describe('fs', function(){
      describe('#readFile()', function(){
        it('should read without error', function(done){
          fs.readFile("test/test.js", function (err, data) {
            if (err) throw err;
            done();
          });
        });
      });
    });
    
####To run this test: 

    mocha -R spec test.js


