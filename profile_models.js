module.exports = function (db) {
	
	db.define('profile_v100', {
		id	        : Number, 
		name	        : String,
		no_ports        : Number,
		table_size      : Number,
		
		flow_stats      : Boolean, //Switch capabilities from feature_res 
                table_stats     : Boolean,
                port_stats      : Boolean,
                stp             : Boolean,
                reserved        : Boolean,
                ip_reasm        : Boolean,
                queue_stats     : Boolean,
                arp_match_ip    : Boolean,

		output          : Boolean, //Switch actions from feature_res
		set_vlan_vid    : Boolean,
		set_vlan_pcp    : Boolean,
		strip_vlan      : Boolean,
		set_dl_src      : Boolean,
                set_dl_dst      : Boolean,
		set_nw_src	: Boolean,
		set_nw_dst	: Boolean,
		set_nw_tos	: Boolean,
		set_tp_src	: Boolean,
		set_tp_dst	: Boolean,
		enqueue		: Boolean
	});
}
