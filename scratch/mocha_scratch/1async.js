/*
Testing asynchronous code
-------------------------
Simply invoke the callback when your test is complete. By adding a callback (usually named done) to 'it()' Mocha will know that it should wait for completion.
*/

var assert = require('should');
describe('User',function() {
    describe('#save()',function(){
        it('should save without error', function(done){
            var user = new User('Luna');
            /*
            user.save(function(err){
                if(err) throw err;
                done();
            });
            */
            user.save(done);//Since done() accepts an error, we may use this directly
        });
    });
});

