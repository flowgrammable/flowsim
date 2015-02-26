/**
 * Created by sasha on 2/8/15.
 */
'use strict';

var PacketPage = require('../pages/packet.js');

describe('packet page', function () {
  var page = new PacketPage();

  beforeEach(function () {
    element(by.linkText("Packet")).click();

  });


  describe('packet list', function () {
    it('should start with empty list', function () {
      expect(page.packetList.count()).toEqual(0);

    });

    it('should add a packet', function () {
      page.addPacket('pa');
      expect(page.packetList.count()).toEqual(1);
      expect(page.packetAt(0)).toEqual('pa');
      expect(page.protocolOptions.count()).toEqual(6);
      page.protocolOptions.get(1).click();
      page.addProtocol();
      expect(page.protocolOptions.count()).toEqual(5);
      page.protocolOptions.get(1).click();
      page.addProtocol();
      expect(page.protocolOptions.count()).toEqual(1);
    });
    it('should add another packet', function () {
      page.addPacket('pa2');
      expect(page.packetList.count()).toEqual(2);
      expect(page.packetAt(1)).toEqual('pa2');
    });
    it('should delete  packet pa2', function () {
      page.deletePacket(1);
      expect(page.packetList.count()).toEqual(1);
      expect(page.packetAt(0)).toEqual('pa');
    });

  });
});
