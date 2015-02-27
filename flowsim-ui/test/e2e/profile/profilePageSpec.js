/**
 * Created by sasha on 2/8/15.
 */
'use strict';

var ProfilePage = require('../pages/profile.js');

describe('profile page', function () {
  var page = new ProfilePage();

  beforeEach(function () {
    element(by.linkText("Profile")).click();

  });


  describe('profile list', function () {
    it('should start with empty list', function () {
      expect(page.profileList.count()).toEqual(0);

    });

    it('should add a profile', function () {
      page.addProfile('profile1');
      expect(page.profileList.count()).toEqual(1);
      expect(page.profileAt(0)).toEqual('profile1');
    });
    it('should add another profile', function () {
      page.addProfile('profile2');
      expect(page.profileList.count()).toEqual(2);
      expect(page.profileAt(1)).toEqual('profile2');
    });
    it('should delete  profile profile2', function () {
      page.deleteProfile(1);
      expect(page.profileList.count()).toEqual(1);
      expect(page.profileAt(0)).toEqual('profile1');
    });

  });
});
