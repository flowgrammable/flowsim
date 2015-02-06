
##1. Provide modular scoping

   Begin and end all files/modules with an anonymous function applicaiton. This
   helps provide a uniform mechanism for all of our files/modules to have local
   scope and not leak symbols into a calling context.

    ```
    (function(){
      ...
    })();
    ```

##2. Define callbacks for asynchronous use

   When providing callbacks for asynchronous functions always use the first
   parameter for error passing. Only use the second and above parameters for
   passing in successful results.

    ```
    function(err, result) {
      if(err) {
        //handle the error
      } else {
        //hanlde the result
      }
    }
    ```

##3. Use callbacks appropriately

   When invoking callbacks that use the standard error first parameter style
   always pass null as the error value when no error is present.

   ```
   /* to pass an error */
   callback(some_error_value);

   /* to pass normal results */
   callback(null, some_result_value);
   ```

##4. Nodejs import ordering

   Always import your external dependencies before you import your local 
   dependencies. An external dependency is found in node_modules or some other
   module/dependency location. Local dependencies are local to the project.

   ```
   var external_dep1 = require('external_dep1');
   var external_dep2 = require('external_dep2');
   var internal_dep1 = require('./internal_dep1');
   var internal_dep2 = require('../utils/internal_dep2');
   ```

##5. Syntax things
  - tab stops are bad, do not use them
  - set your indentation to 2 spaces
  - always use braces with conditionals and loops
  - always begin an open brace on the same line as control element
  - always use jshint and fix all errors/warnings

##6. Variables
  - always use the var keyword for variable introduction
  - you almost never have a good reason for a global
  - always place var statements at beginning of functions (never in loops)

  ```
  function() {
    var good;
    for(var bad=0; bad<some_number; ++bad) {
    ...
    }
  }
  ```

##7. Object closures
  - use the variable `that` for `this` closures
  - initialize `that` immediately
  - or if using underscore, pass in the this variable

  ```
  SomeObject.prototype.methodX = function() {
    // this - has no meaning in closure
    // that - user defined closure variable for 'this'
    var that = this;

    return function(x) {
      return that.foo(x);
    };
  };   

  // now we use an inner function that forgets about 'this'
  _.each(this.list, function(item) {
    // now we can safely refer to the object
    this.add(item);
  }, this);
  ```

