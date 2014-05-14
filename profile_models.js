module.exports = function (db) {
	
	var Profile = db.define('profile', {
		id	        : Number, 
		name	        : String,
		no_ports        : Number
	});
	
	var Flow_table_caps = db.define('flow_table_caps', {
		id	: Number,
		profile_id : Number,
		table_id : Number,
		flow_capacity : Number
	});
	Flow_table_caps.hasOne("profile", Profile, {
		reverse : "flow_table_caps"
	});
}
