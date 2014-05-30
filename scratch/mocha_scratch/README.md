MOCHA TEST FRAMEWORK
----------------------------
* It is a feature-rich JS test framework running on node.js and the browser, making asynchronous testing simple and fun.
* It has many features, which is listed on their site.
* It allows us to use any assertion library we want.
* To see examples on how to run tests on synchronous and asynchronous code, check '1async.js' and '2sync.js'
* We can also write pending test-cases, these are simply those without a callback. Check 'pendingTest.js' for an example.
* Exclusivity feature allows us to run only the specified suite or test-case by appending '.only()' to the call. Check 'exclusiveTest.js' for an example.
* Similarly we can have inclusive tests i.e. use '.skip()' to the call to tell mocha to ignore these suite(s) and test-case(s). This puts them in pending state, and is favoured over commenting out tests which we may forget to uncomment. Check 'inclusiveTest.js' for an example.
  

describe()
==========
* commonly known as test suites, which contains test cases
* It is used for grouping test cases and we can have groups within groups


it()
====
This is used to write a test case

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

Reference:
=========
* http://visionmedia.github.io/mocha/
* http://samwize.com/2014/02/08/a-guide-to-mochas-describe-it-and-setup-hooks/
* http://dailyjs.com/2011/12/08/mocha/
