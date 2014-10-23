// Openflow 1.0 profile stored in psql
//
{
	// datapath config
	"dpName"						: "a cool profile",
	"dpVersion"					: "1.0",
	"dpID"							: "abcd",
	"dpBuffers"					: 10,
	"dpTables"					: 1,
	"dpMFRDescription"	: "flowsim switch",
	"dpHWDescription"		: "fake hardware",
	"dpSWDescription"		: "fake software",
	"dpSerial"					: "fake serial",
	"dpDescription"			: "profile based on <vendor> <model> openflow switch",
	"dpFragHandling"		: true
	"confIPRassem"			: true,
	"confPortblocked"		: true,

	// ports config
	"ports": [{
		"id" : "0",
		"hw_addr" : "aa:bb:cc:dd:ee:ff",
		"name" : "port of houston",
		"currentSpeed" : //speed config necessary?,
	}],

	// config virtual ports
	"portsNormal" : false,
	"portsFlood"	: false,

	// Queues config
	"queuesStats" : {
		"tx_bytes" 		: true,
		"tx_packets" 	: false,
		"tx_errors" 	: false
		}
	"queues" : [{
		"id" : 0,
		"min_rate_supported" : 100,
	}],

	"tables":[{
		"id" : 0,
		"name" : "the flow table in 1.0",
		"max_entries" 		: 256,
		"table_stats" 		: true,
		"flow_stats"			: false,
		"miss_controller" : true,

		// Field configuration
		// [match, wildcard, mask, write_setfield, write_setfield_miss,
		//  apply_setfield, apply_setfield_miss]
		// in this example all field capabilities supported by
		// openflow 1.0 are enabled
		"inPort" 			: [1, 1, 0, 0, 0, 0, 0],
		"ethDst"			: [1, 1, 0, 0, 0, 1, 0],
		"ethSrc"			: [1, 1, 0, 0, 0, 1, 0],
		"ethType"			: [1, 1, 0, 0, 0, 0, 0],
		"vlanId"  		: [1, 1, 0, 0, 0, 1, 0],
		"vlanPcp" 		: [1, 1, 0, 0, 0, 1, 0],
		"ipv4Src" 		: [1, 1, 1, 0, 0, 1, 0],
		"ipv4Dst" 		: [1, 1, 1, 0, 0, 1, 0],
		"ipv4Tos" 		: [1, 1, 0, 0, 0, 1, 0],
		"ipv4Proto" 	: [1, 1, 0, 0, 0, 0, 0],
		"l4Src" 			: [1, 1, 0, 0, 0, 1, 0],
		"l4Dst" 			: [1, 1, 0, 0, 0, 1, 0],
		"icmpv4Type"	: [1, 0, 0, 0, 0, 0, 0],
		"icmpv4Code"	: [1, 0, 0, 0, 0, 0, 0],
		"arpOpCode"   : [1, 0, 0, 0, 0, 0, 0],

		// Action configuration
		// [write_actions, write_actions_miss,
		//   apply_actions, apply_actions_miss ]
		"popVlan" 	: [0, 0, 1, 0],
		"setQueue"	: [0, 0, 1, 0],

		// Instruction Configuration
		// [instruction, instruction_miss]
		"applyAction" : [1, 0]
	}]
