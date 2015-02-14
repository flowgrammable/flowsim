'use strict';

var PacketPage = function () {
    var ptor = protractor.getInstance();
    ptor.get('/#/packet');
};

PacketPage.prototype = Object.create({}, {
    packetName: { get: function () { return element(by.model('itemName')); }},
    addButton: { get: function () { return element(by.css('button.btn.btn-default')); }},
    packetList: { get: function () { return element.all(by.repeater('item in items')); }},
    packetAt: { value: function (idx) { return this.packetList.get(idx).getText(); }},
    packetDeleteButton: { get: function(idx){ return element.all(by.repeater('item in items')).get(idx).element(by.css('glyphicon.glyphicon-minus-sign.pull-right'))}},
    nodeType: { value: function (idx) { return element(by.model('nodeType')); }},
    addPacket: { value: function (packet) {
        this.packetName.sendKeys(packet);
        this.addButton.click();
    }},
    deletePacket: { value: function (idx) {
        this.packetDeleteButton(idx).click();
    }}
});

module.exports = PacketPage;