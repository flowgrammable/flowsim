/**
 * Created by sasha on 2/14/15.
 */
/**
 * Created by sasha on 2/8/15.
 */
'use strict';

//var PacketPage = require('./pages/packet.js');

describe('Navigation test', function () {

    browser.get("http://0.0.0.0:9000/");
  beforeEach(function () {

    element(by.linkText("Login")).click();
    element(by.id("email")).sendKeys("test@test.com");
    element(by.id("password")).sendKeys("test");
    element(by.css("button.btn.btn-default")).click();
  });


  describe('navigation test', function () {
    it('should start with empty list', function () {
      element(by.linkText("Packet")).click();
      element(by.linkText("Profile")).click();
      element(by.linkText("Switch")).click();
      element(by.linkText("Simulation")).click();
      element(by.linkText("Account")).click();

    });
  });
});

