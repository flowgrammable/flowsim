// Openflow 1.0 capabilities 
{
	/** Datapath Capabilities supported in all versions
	"dpName"						: true,
	"dpVersion"					: true,
	"dpID"							: true,
	"dpBuffers"					: true,
	"dpTables"					: true,
	"dpMFRDescription"	: true,
	"dpHWDescription"		: true,
	"dpSWDescription"		: true,
	"dpSerial"					: true,
	"dpDescription"			: true,
	**/

	"dpIPRassem"		: true,      // optional
	"dpPortblocked"	: true,      // optional

	/** Individual port capabilities supported in all versions
	 * port_id
	 * hw_addr
	 * name
	 * supported_speed
	 * mode
	 * medium
	 * auto_neg
	 * pause
	 * pause_asym
	 **/
	"portsFiberRxTune" : false,
	"portsFiberTxTune" : false,
	"portsFiberTxPwer" : false,
	"portsFiberUseFreq": false,
	"portsSTPListen"   : true,
	"portsSTPLearn"    : true,
	"portsSTPFoward"   : true,
	"portsSTPBlock"    : true,
	"portsSTPMask"     : true,
	"portsLinkDown"    : true,
	"portsBlocked"     : false,
	"portsLive"        : false,

	// Virtual Ports supported in 1.0
	"portsNormal": true,		// optional
	"portsFlood" : true,    // optional
	"portsLocal" : true,    // required
	"portsAny"   : false,
	// Virtual Ports supported and required in all versions
	// ALL, CONTROLLER, TABLE, IN_PORT

	// Ports capabilities supported in all versions, never optional
	// portStats

	//Supported port speeds in 1.0
	"portSpeeds":{
		"10MB" : true,
		"100MB": true,
		"1GB"  : true,
		"10GB" : true,
		"40GB" : false,
		"100GB": false,
		"1TB"  : false,
		"OTHER": false
	}

	/** Queues capabilities supported by all versions
	    - no_queues
			- queue_stats (optional in every version)
	**/

	/** Individual queue capabilities supported by all versions
			- queue_id
			- min_rate_supported (optional in every version)
	**/
	"queueMaxRateSupported" : false,

	/** Queue stat capabilities supported by every version
			- tx_bytes (optional in every version)
			- tx_packets (optional in 1.0-1.1, required in 1.2-1.4)
			- tx_errors (optional in all versions)
	**/
	"queueStatDurationSec" : false,
	"queueStatDurationNSec": false,

	/** Meters **/
	"metersNumber"  		: false,
	"metersMaxMeter"		: false,
	"metersDropBand" 		: false,
	"metersDSCP_remark" : false,
	"metersKbps"				: false,
	"metersPktps"				: false,
	"metersBurst"				: false,
	"metersStats"				: false,
	"metersMaxBand"			: false,
	"metersMaxColor"		: false,





		// Flowtable Capabilities


		// Field Capabilities
		//
		// fieldX : [match, wildcard, mask,  write_setfield, write_setfield_miss,
		//  apply_setfield, apply_setfield_miss]
		// 1 indicates if field is configurable
		// Example
		// fieldInPort : [1, 1, 0, 0, 0, 0]
		// In openflow 1.0 match and wildcard InPort field supported
		// write_action_setfield_inport instruction not supported
		// write_action_setfield_inport_miss instruction not supported
		// apply_action_setfield_inport instruction not supported
		// apply_action_setfield_inport_miss instruction not supported
		"fieldInPort" 		: [1, 1, 0, 0, 0, 0, 0],
		"fieldInPhyPort" 	: [0, 0, 0, 0, 0, 0, 0],   // field does not exist in 1.0
		"fieldMetadata"		: [0, 0, 0, 0, 0, 0, 0],   // field does not exist in 1.0
		// Ethernet example:
		// ethDst: [1, 1, 0, 0, 1, 0]
		// In openflow 1.0 match and wildcard ethDst field supported
		// write_action_setfield_ethDst not supported
		// write_action_setfield_miss_ethDst not supported
		// apply_action_setfield_ethDst supported
		// apply_action_setfield_miss_ethDst not supported
		"fieldEthDst"		: [1, 1, 0, 0, 0, 1, 0],
		"fieldEthSrc"		: [1, 1, 0, 0, 0, 1, 0],
		"fieldEthType"	: [1, 1, 0, 0, 0, 1, 0],


		// Action Capabilities
  	// [write_actions, write_actions_miss, apply_actions, apply_actions_miss]
		// Example
		// actionCopyTTLOUT: [0,0,0,0]
		// In openflow 1.0 copyTTLOUT not supported
    "actionCopyTTLOUT"	: [0, 0, 0, 0],
    "actionCopyTTLIN"		: [0, 0, 0, 0], // not supported
    "actionSetMPLSTTL"	: [0, 0, 0, 0],	// not supported
    "actionDecMPLSTTL"	: [0, 0, 0, 0],	// not supported
    "actionPushVLAN"		: [0, 0, 0, 0], // not supported
		// Example
		// actionPopVLAN : [0,0,1,0]
		// In openflow 1.0 pop vlan supported
		// write_popVLAN not supported
		// write_popVLAN_miss not supported
		// apply_popVLAN supported
		// apply_popVLAN_miss not supported
    "actionPopVLAN"		: [0, 0, 1, 0],
    "actionPushMPLS"	: [0, 0, 0, 0], 	// not supported
    "actionPopMPLS"		: [0, 0, 0, 0],  	// not supported
    "actionSetQueue"	: [0, 0, 1, 0], 	// not supported
    "actionSetNWTTL"	: [0, 0, 0, 0], 	// not supported
    "actionDecNWTTL"	: [0, 0, 0, 0], 	// not supported
    "actionPushPBB"		: [0, 0, 0, 0],  	// not supported
    "actionPopPBB"		: [0, 0, 0, 0],   // not supported


    // Instruction Capabilities
		//
    // [instruction, instruction_miss]
		// Example: instructionMeter:[0,0]
		// directing a packet to a meter is not supported in 1.0
		// directing a packet to a meter on miss is not supported in 1.0
		"instructionMeter"	: [0,0]
		// Example: applyAction:[1,0]
		// The only supported instruction in openflow 1.0 is apply_action
    "instructionApplyAction"	: [1, 0]
		"instructionClearAction"	: [0, 0]  	// not supported
		"instructionWriteAction"	: [0, 0]  	// not supported
		"instructionWriteMetadata": [0, 0] 		// not supported
