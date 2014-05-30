/*
Testing synchronous code
------------------------
For this omit callback and Mocha will automatically continue on to the next test
*/

var assert = require('should');
describe('Array',function() {
    describe('#indexOf()',function(){
        it('should return -1 when the value is not present',function() {
            [1,2,3].indexOf(5).should.equal(-1);
            [1,2,3].indexOf(0).should.equal(-1);
            });
        });
   });
