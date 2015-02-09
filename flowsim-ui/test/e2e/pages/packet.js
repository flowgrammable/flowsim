'use strict';

var PacketPage = function () {
    browser.get('http://localhost:9001/#/packet');
};

PacketPage.prototype = Object.create({}, {
    packetName: { get: function () { return element(by.model('itemName')); }},
    addButton: { get: function () { return element(by.css('button.btn.btn-default')); }},
    packetList: { get: function () { return element.all(by.repeater('item in items')); }},
    packetAt: { value: function (idx) { return this.packetList.get(idx).getText(); }},
    addPacket: { value: function (packet) {
        this.packetName.sendKeys(packet);
        this.addButton.click();
    }}
});

module.exports = PacketPage;