'use strict';

var PacketPage = function () {

};

PacketPage.prototype = Object.create({}, {
  packetName: {
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
  packetList: {
    get: function () {
      return element.all(by.repeater('item in items'));
    }
  },
  packetAt: {
    value: function (idx) {
      return this.packetList.get(idx).getText();
    }
  },
  protocolOptions: {
    get: function () {
      return element.all(by.options('key as value for (key, value) in options'));
    }
  },

  packetDeleteButton: {
    value: function (idx) {
      return this.packetList.get(idx).element(by.css('.glyphicon-minus-sign'));
    }
  },
  nodeType: {
    value: function () {
      return element(by.model('nodeType'));
    }
  },
  addPacket: {
    value: function (packet) {
      this.packetName.sendKeys(packet);
      this.addButton.click();
    }
  },
  deletePacket: {
    value: function (idx) {
      this.packetDeleteButton(idx).click();
    }
  },
  addProtocol: {
    value: function () {
      this.protocolAddButton.click();
    }
  }
});

module.exports = PacketPage;
