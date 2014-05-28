module.exports = function (db) {
	
	var Profile = db.define("profile", {
		id : {type: "integer", unique: true, defaultValue: undefined }, 
		name : { type: "text", size: 128, unique: true },
		no_ports : { type: "integer"}
	});
	
	var Flow_table_caps = db.define('flow_table_caps', {
		id : { type: "integer", unique: true, defaultValue: undefined },
		profile_id : { type: "integer"} ,
		table_id : { type: "integer" },
		flow_capacity : { type: "integer" }
	});

	Flow_table_caps.hasOne("profile", Profile, {
		reverse : "flow_table_caps"
	});

	var Supported_match = db.define('supported_match', {
		id : { type: "integer", unique: true, defaultValue: undefined },
		flow_table_caps_id: { type: "integer" },
		protocol : { type: "text", size: 20 },
		field : { type: "text", size: 20 },
		maskable : { type: "boolean" },
		bits : { type: "integer" }
	});

        Supported_match.hasOne("flow_table_caps", Flow_table_caps, {
		reverse: "supported_match",
		autofetch: true
	});


//	Supported_match.hasOne("flow_table_caps", Flow_table_caps, {
//		reverse : "supported_match"
//	});
}
