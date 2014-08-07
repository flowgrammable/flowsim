var bcrypt = require('bcrypt');
var validator = require('validator');

module.exports = function (db,orm) {
  var Switch_Profile = db.define('switch_profile', {
    id : { 
      type: 'integer', 
      unique: true, 
      defaultValue: undefined 
    },
    sub_id : { 
      type: 'integer', 
    },
    name : { 
      type: 'text', 
      size: 60 
    }

  });

  var DP_Caps = db.define('dp_caps', {
    id : { 
      type: 'integer', 
      unique: true, 
      defaultValue: undefined 
    },
    profile_id : { 
      type: 'integer'  
    },
    vp_all : {
			type: 'boolean',
			defaultValue: 'true'
		},
		vp_controller : {
			type: 'boolean',
			defaultValue: 'true'
		},
		vp_table : {
			type: 'boolean',
			defaultValue: 'true'
		},
		vp_in_port : {
			type: 'boolean',
			defaultValue: 'true'
		},
		vp_any : {
			type: 'boolean',
      defaultValue: 'false'
		},
		vp_local : {
			type: 'boolean',
	    defaultValue: 'false'
		},
		vp_normal : {
			type: 'boolean',
			defaultValue: 'false'
		},
		vp_flood : {
			type: 'boolean',
			defaultValue: 'false'
		}
  });

  var FT_Caps = db.define('ft_caps', {
		id : {
			type: 'integer',
			unique: true,
			defaultValue: undefined
		},
		dp_id : {
			type: 'integer'
		},
		table_id : {
			type: 'integer',
			defaultValue: '1'
		},
		max_entries : {
			type: 'integer',
			defaultValue: '64'
		}
  });

  var Match_Caps = db.define('match_caps', {
		id : {
			type: 'integer',
			unique: true,
			defaultValue: undefined
		},
		ft_id : {
			type: 'integer'
		},
		ofpxmt_ofb_in_port : {
			type: 'boolean',
			defaultValue: 'false'
		},
		ofpxmt_ofb_in_phy_port : {
			type: 'boolean',
			defaultValue: 'false'
		},
		ofpxmt_ofb_eth_dst : {
			type: 'boolean',
			defaultValue: 'false'
		},
    ofpxmt_ofb_eth_src : {
			type: 'boolean',
			defaultValue: 'false'
		},
		ofpxmt_ofb_eth_type : {
			type: 'boolean',
			defaultValue: 'false'
		}
	});

	var Instruction_Caps = db.define('instruction_caps', {
		id : {
			type: 'integer',
			unique: true,
			defaultValue: undefined
		},
		ft_id : {
			type: 'integer'
		},
		ofpit_apply_actions : {
			type: 'boolean',
			defaultValue: 'true'
		}
	});

	var Action_Caps = db.define('action_caps', {
		id : {
			type: 'integer',
			unique: true,
			defaultValue: undefined
		},
		ft_id : {
			type: 'integer'
		},
		ofpat_output : {
			type: 'boolean',
			defaultValue: 'true'
		},
		ofpat_set_field_eth_dst : {
			type: 'boolean',
			defaultValue: 'false'
		},
		ofpat_set_field_eth_src : {
			type: 'boolean',
			defaultValue: 'false'
		}
	});

		
}
