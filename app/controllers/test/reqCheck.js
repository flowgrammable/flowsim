var request = require('request');
var assert = require('assert');

describe('Testing client requests:',function() {
    it('User registered successfully',function(done) {
            request({
                url: "http://localhost:8000/subscribers",
                body: "{ \"email\": \"user111@user3.com\", \"password1\": \"my password\", \"password2\":\"my password\" }",
                headers: {"Content-Type": "application/json"},
                method: "POST"
            }, function (error, response, body) {
                console.log("\n\tStatus : "+ response.statusCode);
                assert.equal(response.statusCode,201);
                console.log("\tResponse received : ", body);
                done();
            });
    });

    it('Invalid e-mail address',function(done) {
            request({
                url: "http://localhost:8000/subscribers",
                body: "{ \"email\": \"user1user3.com\", \"password1\": \"my password\", \"password2\":\"my password\" }",
                headers: {"Content-Type": "application/json"},
                method: "POST"
            }, function (error, response, body) {
                console.log("\n\tStatus : "+ response.statusCode);
                assert.equal(response.statusCode,400);
                console.log("\tResponse received : ", body);
                done();
            });
    });
    it("Password is not in the range of 8-16",function(done) {
            request({
                url: "http://localhost:8000/subscribers",
                body: "{ \"email\": \"user1@user3.com\", \"password1\": \"my\", \"password2\":\"my\" }",
                headers: {"Content-Type": "application/json"},
                method: "POST"
            }, function (error, response, body) {
                console.log("\n\tStatus : "+ response.statusCode);
                assert.equal(response.statusCode,400);
                console.log("\tResponse received : ", body);
                done();
            });
    });
    it("Password Mismatch",function(done) {
            request({
                url: "http://localhost:8000/subscribers",
                body: "{ \"email\": \"user11@user3.com\", \"password1\": \"my password\", \"password2\":\"my password12\" }",
                headers: {"Content-Type": "application/json"},
                method: "POST"
            }, function (error, response, body) {
                console.log("\n\tStatus : "+ response.statusCode);
                assert.equal(response.statusCode,400);
                console.log("\tResponse received : ", body);
                done();
            });
    });
    it("E-mail Address is already registered",function(done) {
            request({
                url: "http://localhost:8000/subscribers",
                body: "{ \"email\": \"user1@user3.com\", \"password1\": \"my password\", \"password2\":\"my password\" }",
                headers: {"Content-Type": "application/json"},
                method: "POST"
            }, function (error, response, body) {
                console.log("\n\tStatus : "+ response.statusCode);
                assert.equal(response.statusCode,409);
                console.log("\tResponse received : ", body);
                done();
            });
    });
});
