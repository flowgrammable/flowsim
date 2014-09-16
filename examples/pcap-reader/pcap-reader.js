
var fs = require('fs');

var GLOBAL_HEADER = 24; //bytes
var PACKET_HEADER = 16; //bytes

// top level PcapReader object
function PcapReader(fileName) {
  this.initialized = false;
  this.inPcap = fs.createReadStream(fileName);
  this.inPcap.on('readable', onReadable.bind(this));
  this.inPcap.on('end', onEnd.bind(this));
}
exports.PcapReader = PcapReader;

// packet object
function Packet(sec, nsec, capBytes, origBytes, packet) {
	this.ts_sec = sec;
	this.ts_nsec = nsec;
	this.incl_len = capBytes;
	this.orig_len = origBytes;
	this.pkt = packet;
}

function onReadable() {
  var buffer;
  
  do {
		if (this.initialized) {
			buffer = this.inPcap.read(PACKET_HEADER);
			// continue if successfully read enough bytes
			if (buffer) {
				//console.log('decoding packet header');
				this.pkt = decodePacketHeader(buffer);
				console.log(this.pkt.desc);
				console.log('ts_sec: '+this.pkt.ts_sec);
				console.log('ts_usec: '+this.pkt.ts_usec);
				console.log('included bytes: '+this.pkt.incl_len);
				console.log('original bytes: '+this.pkt.orig_len);
				
				// read in payload portion
				if (this.pkt.incl_len > 0) {
					// wait for payload to be read in
					var done = false;
					do {
						var packet = this.inPcap.read(this.pkt.incl_len);
						if (buffer !== null) {
							done = true;
							this.pkt.data = packet;
						}
					} while (!done);
				}
				else {
					console.log('WARNING: no packet data available for this pkt...');
				}
			}
		}
		else {
			buffer = this.inPcap.read(GLOBAL_HEADER);
			// continue if successfully read enough bytes
			if (buffer) {
				console.log('decoding global header');
				this.initialized = true;
				this.global = decodeGlobalHeader(buffer);
				console.log(this.global.desc);
				console.log('major version: '+this.global.major_version);
				console.log('minor version: '+this.global.minor_version);
				console.log('gmt offset: '+this.global.gmt_offset);
				console.log('ts accuracy: '+this.global.ts_accuracy);
				console.log('net link: '+this.global.net_link);
			}
		}
	} while (buffer !== null);
}

function onEnd() {
  console.log('end of pcap file reached');
}

function decodeGlobalHeader(buffer) {
  var globalHdr = {};
  globalHdr.desc = "this will be a global hdr object";
  
  // first figure out byte ordering of pcap file
  var magic_number = buffer.readUInt32LE(0);
  console.log('magic_number: ' + magic_number.toString(16));
  if (magic_number == parseInt('a1b2c3d4', 16)) {
    console.log('little endian detected');
    this.LE = true;
    this.readUInt32 = buffer.readUInt32LE;
    this.readUInt16 = buffer.readUInt16LE;
    this.readInt32 = buffer.readInt32LE;
    this.readInt16 = buffer.readInt16LE;
  }
  else if (magic_number == parseInt('d4c3b2a1', 16)) {
    console.log('big endian detected');
    this.LE = false;
    this.readUInt32 = buffer.readUInt32BE;
    this.readUInt16 = buffer.readUInt16BE;
    this.readInt32 = buffer.readInt32BE;
    this.readInt16 = buffer.readInt16BE;
  }
  else {
    throw 'ERROR: unkown magic_number';
  }
  
  // read in remainder of global header (fancy method):
  //var pos = 4;
  //globalHdr.major_version = this.readUInt16(pos);  //does not work as expected
  //pos += 2;
  // ...(one block of code that calls either BE or LE varient as needed)...
  
  // read in remainder of global header (simple method):
  if (LE) {
    var pos = 4;
		globalHdr.major_version = buffer.readUInt16LE(pos);
		pos += 2;
		globalHdr.minor_version = buffer.readUInt16LE(pos);
		pos += 2;
		globalHdr.gmt_offset = buffer.readInt32LE(pos);
		pos += 4;
		globalHdr.ts_accuracy = buffer.readUInt32LE(pos);
		pos += 4;
		globalHdr.max_capture = buffer.readUInt32LE(pos);
		pos += 4;
		globalHdr.net_link = buffer.readUInt32LE(pos);
		pos += 4;
  }
  else {
  	var pos = 4;
		globalHdr.major_version = buffer.readUInt16BE(pos);
		pos += 2;
		globalHdr.minor_version = buffer.readUInt16BE(pos);
		pos += 2;
		globalHdr.gmt_offset = buffer.readInt32BE(pos);
		pos += 4;
		globalHdr.ts_accuracy = buffer.readUInt32BE(pos);
		pos += 4;
		globalHdr.max_capture = buffer.readUInt32BE(pos);
		pos += 4;
		globalHdr.net_link = buffer.readUInt32BE(pos);
		pos += 4;
  }
  
  return globalHdr;
}

function decodePacketHeader(buffer) {
	var packetHdr = {};
  packetHdr.desc = "this will be a packet hdr object";
  
  // recall pcap file byte byte ordering
  //console.log('this.LE: '+this.LE);
  // ... if (this.LE) then set local function calls appropriately...
  
  // read in packet header (simple method):
  if (this.LE) {
  	var pos = 0;
		packetHdr.ts_sec = buffer.readUInt32LE(pos);
		pos += 4;
		packetHdr.ts_usec = buffer.readUInt32LE(pos);
		pos += 4;
		packetHdr.incl_len = buffer.readUInt32LE(pos);
		pos += 4;
		packetHdr.orig_len = buffer.readUInt32LE(pos);
		pos += 4;
  }
  else {
  	packetHdr.ts_sec = buffer.readUInt32BE(pos);
		pos += 4;
		packetHdr.ts_usec = buffer.readUInt32BE(pos);
		pos += 4;
		packetHdr.incl_len = buffer.readUInt32BE(pos);
		pos += 4;
		packetHdr.orig_len = buffer.readUInt32BE(pos);
		pos += 4;
  }
  
  return packetHdr;
}
