/*Currently only one .only() call is respected*/
var assert = require('assert');
describe('Array',function() {
    describe.only('#indexOf()',function(){
        it('should return -1 when the value is not present',function() {
            //assert.equal(-1, [1,2,3].indexOf(1));
            assert.equal(-1,[1,2,3].indexOf(0));
           });
        });
    describe('#length()',function() {
        it('should be of length 3', function() {
            assert.equal(3,[1,2,3].length);
            //assert.equal(3,[1,2,2,3].length);
        });
        //only() can also be used for test-case
        /*it.only('should be of length 4', function() {
            //assert.equal(3,[1,2,3].length);
            assert.equal(4,[1,2,2,3].length);
        });*/

    });
   });


