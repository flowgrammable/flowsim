var url = require('url');

function retrieve_profile(req,res, db){
	var url_parts = url.parse(req.url);             // parse url
	var profile_id = url_parts.pathname.substr(1);  // remove /

	// Get all flow tables associated with the switch profile ID	
        db.models.profile(profile_id).getFlow_table_caps(function (err, tables) {
		if(err) throw err;
		console.log(tables[0].table_id);
		console.log(tables[0].flow_capacity);
		console.log(tables[1].table_id);
		console.log(tables[1].flow_capacity);
	});

        db.models.flow_table_caps.get(1, function(err, caps){
		console.log(caps);
	});

	db.models.supported_match.get(1, function(err, match){
		console.log(match.id);
	//	console.log(match[0].protocol);
	//	console.log(match[0].field);
	//	console.log(match[0].maskable);
	//	console.log(match[0].bits);
	});
}


function create_flow_table_caps( db, profile){
	db.models.flow_table_caps.create([
	{ id : 1,
	  profile_id : profile.id,
	  table_id : 1,
	  flow_capacity : 64,
	},
	{ id : 2,
	  profile_id : profile.id,
	  table_id : 2,
	  flow_capacity : 32
	}], function(err, table_caps){
		if(err){
		throw err;
		}
		else{
		db.models.supported_match.create(
		{ id: 1,
	          flow_table_caps_id: table_caps[0].id,
		  protocol: "ipv4",
		  field: "src",
		  maskable: true,
		  bits: 32
		}, function(err) {
		   if (err) throw err;
		});
		}
	});
}

function create_profile(req, res, db){
	var data = '';
	req.on('data', function (chunk){
		data += chunk;
	});
	req.on('end', function (chunk) {
		var obj = JSON.parse(data);
		db.models.profile.create(
		{ id                : obj.id,
		  name              : obj.name,
		  no_ports	    : obj.no_ports
		}, function (err, profile) {
		    if (err){
			 throw err;
	 	    } else {
			create_flow_table_caps(db, profile);
		    }
		});

		  
	});
}

module.exports = function(db) {
  return function(req, res, next) {
    switch(req.method) {
      case 'GET':
	retrieve_profile(req,res, db);
	console.log('someone made a GET to /api/profiles');
	break;
      case 'POST':
	create_profile(req, res, db);
	console.log('someone made a POST to /api/profiles');
	break;
      default:
        res.end('Fuck you, only get and post work right now!');
        break;
    }
  }
}
