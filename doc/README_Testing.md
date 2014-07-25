**UNIT TEST RUNNER**
--------------------
--------------------

HOW TO RUN TESTS
================
* Mocha test framework is used for testing.
* To run mocha tests, just add all the mocha javascript test files in a folder called "test"
* From the root directory of the project, run "make test" to execute that Makefile, which runs mocha tests on all the files present in the test folder.
* Or, can also run "npm test" from the root directory to run all tests.

MOCHA TEST FRAMEWORK
----------------------------
  It is a feature-rich JS test framework running on node.js and the browser, making asynchronous testing simple and fun.
  + describe()
    * commonly known as test suites, which contains test cases
    * It is used for grouping test cases and we can have groups within groups
  + it()
    * This is used to write a test case

before(), beforeEach(), after(), afterEach() 
============================================
* All 'hooks' may be sync or async as well, behaving much like a regular test-case.
* They are hooks to run before/after first/each it() or describe(), which means, `before()` is run before first it()/describe()
* Look at 'mocha-guide-to-testing.js' file for good examples. This file is taken from "Junda Ong's" blog on "A guide to Mocha's Describe(), It() and Setup Hooks".

before()
========
Run once before the first test-case/test-suite

beforeEach()
============
Run once before each test-case/test-suite

after()
=======
Run once before first test-case/test-suite

afterEach()
===========
Run once after each test-case/test-suite

How to Run mocha
================
* By default mocha will use the pattern './test/*.js' if no parameter is given to it.
* By giving filename as parameter to mocha, then mocha will run on the file

Example Code:
=============
