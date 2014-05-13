module.exports = function (db) {
	
	db.define('profile', {
		id	        : Number, 
		name	        : String,
		switch_version  : String,
		no_ports        : Number,
		no_tables       : Number,
		table_size      : Number,
	        match_caps      : Object,
		action_caps     : Object	
	});
}
