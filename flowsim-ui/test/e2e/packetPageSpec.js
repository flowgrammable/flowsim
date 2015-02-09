/**
 * Created by sasha on 2/8/15.
 */
'use strict';

var PacketPage = require('./pages/packet.js');

describe('packet page', function () {
    var page = new PacketPage();

    beforeEach(function () {

    });


    describe('packet list', function () {
        it('should start with empty list', function () {
            expect(page.packetList.count()).toEqual(0);

        });

        it('should add a packet', function () {
            page.addPacket('pa');
            expect(page.packetList.count()).toEqual(1);
            expect(page.packetAt(0)).toEqual('pa');
        });
        it('should add another packet', function () {
            page.addPacket('pa2');
            expect(page.packetList.count()).toEqual(2);
            expect(page.packetAt(1)).toEqual('pa2');
        });
    });
});
