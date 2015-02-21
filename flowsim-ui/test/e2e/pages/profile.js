'use strict';

var ProfilePage = function () {

};

ProfilePage.prototype = Object.create({}, {
  profileName: {
    get: function () {
      return element(by.model('itemName'));
    }
  },
  addButton: {
    get: function () {
      return element(by.css('button.btn.btn-default'));
    }
  },
  protocolAddButton: {
    get: function () {
      return element.all(by.css('button.btn.btn-default')).get(1);
    }
  },
  profileList: {
    get: function () {
      return element.all(by.repeater('item in items'));
    }
  },
  profileAt: {
    value: function (idx) {
      return this.profileList.get(idx).getText();
    }
  },
  protocolOptions: {
    get: function () {
      return element.all(by.options('key as value for (key, value) in options'));
    }
  },

  profileDeleteButton: {
    value: function (idx) {
      return this.profileList.get(idx).element(by.css('.glyphicon-minus-sign'));
    }
  },
  nodeType: {
    value: function () {
      return element(by.model('nodeType'));
    }
  },
  addProfile: {
    value: function (profile) {
      this.profileName.sendKeys(profile);
      this.addButton.click();
    }
  },
  deleteProfile: {
    value: function (idx) {
      this.profileDeleteButton(idx).click();
    }
  },
  addProtocol: {
    value: function () {
      this.protocolAddButton.click();
    }
  }
});

module.exports = ProfilePage;
