#!/usr/bin/env node

var pcap = require('./pcap-reader.js');

PcapReader = new pcap.PcapReader('traces/equinix-sanjose.dirA.20120119-125903.UTC.anon_1MB.pcap');

console.log('Kicked off PcapReader...');

