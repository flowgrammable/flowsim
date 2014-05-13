module.exports = function (db) {
	
	db.define('profile', {
		name           : {type:"text"},
		switch_version : {type:"text"},
		no_ports       : {type:"number"},
		no_tables      : {type:"number"},
		table_size     : {type:"number"}
	});
}
