var hello = require('./7.1custom_hello');
var gb = require('./7.2custom_gb');
hello.helloWorld();
gb.goodBye();

/*

npm - central repository
npm install request
--> will install in node_modules
when we give in require only module name: then it will search like this:

say now i'm in this directory: /home/ashish/Flowgrammable/
and require is like this--> var make_req = require('make_request');
then : 
1) /home/ashish/Flowgrammable/node_modules/
2) /home/ashish/node_modules/make_request.js
3) /home/node_modules/make_request.js
4) /node_modules/make_request.js

say we need an executable to be installed:
 npm install coffee-script -g

global modules cannot be required!!!


Finding modules:
---------------
npm search request
node-toolbox
github
npm repo

Defining your dependencies - modules on which my app depends on
-------------------------------------------------------------
npm makes it easy: just package_json file in the root of your application
just find the name of your application:
my-app/package.json:
{
    "name":
    "version":
    "dependencies": {
        "connect": "1.8.7" -- > 1 is major version, 8 is minor version, 7 is patch number; can use ~--< range : "connect":"~1" --> >=1.0.0 < 2.0.0 ==> dangerous
    }
}
npm install --> will install all dependencies!!
myapp/node_modules/connect

might also want to install sub-dependencies:
connect/node_modules/qs
connect/node_modules/asdf
*/
