var url = require('url');

function retrieve_profile(req,res, db){
	var url_parts = url.parse(req.url);             // parse url
	var profile_id = url_parts.pathname.substr(1);  // remove /

	// Get all flow tables associated with the switch profile ID	
        db.models.profile(profile_id).getFlow_table_caps(function (err, tables) {
		if(err) throw err;
		console.log(tables[0].table_id);
		console.log(tables[0].flow_capacity);
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
		    if (err) throw err;
                    db.models.flow_table_caps.create(
			{ id : 1,
                 	  profile_id : profile.id,
                  	  table_id : 1,
                  	  flow_capacity: 64
		        }, function(err){
			   if(err)throw err;
                    });
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
