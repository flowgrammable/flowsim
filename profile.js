var url = require('url');

function retrieve_profile(req,res, db){
	var url_parts = url.parse(req.url);
	var profile_id = url_parts.pathname.substr(1);
	db.models.profile.get(profile_id, function (err, profile) {
		if(err) throw err;
		var response = '';
		response += 'Profile ID   : ' + profile.id +'\n';
		response += 'Profile Name : ' + profile.name + '\n';
		response += 'No of Ports  : ' + profile.no_ports + '\n';
		response += 'No of Tables : ' + profile.no_tables + '\n';
		response += 'Table Size   : ' + profile.table_size + '\n';
		res.end(response);
	});
}

function create_profile(req, res, db){
	var data = '';
	req.on('data', function (chunk){
		data += chunk;
	});
	req.on('end', function (chunk) {
		var obj = JSON.parse(data);
		console.log(tmp);
		db.models.profile.create([
		{ id                : obj.id,
		  switch_version    : obj.switch_version, 
		  name              : obj.name,
		  no_ports          : obj.no_ports,
		  no_tables         : obj.no_tables,
		  table_size        : obj.table_size,
		  match_caps        : obj.match_caps,
		  action_caps       : obj.action_caps
		} ], function (err) {
		    if (err){
		    res.end('could not post to db\n');
		    throw err;
		    }else{
		    res.end('post sucessful\n');
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
