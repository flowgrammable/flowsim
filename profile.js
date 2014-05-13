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

module.exports = function(db) {
  return function(req, res, next) {
    switch(req.method) {
      case 'GET':
	retrieve_profile(req,res, db);
	console.log('someone made a GET to /api/profiles');
	break;
      case 'POST':
	console.log('someone made a POST to /api/profiles');
        res.end('OK you posted me!');
      default:
        res.end('Fuck you, only get and post work right now!');
        break;
    }
  }
}
