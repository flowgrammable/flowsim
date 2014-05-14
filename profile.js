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
                console.log(data);
		var obj = JSON.parse(data);
		console.log(obj);
		db.models.profile_v100.create([
		{ id                : obj.id,
		  name              : obj.name,
		  no_ports	    : obj.no_ports,
		  table_size        : obj.table_size,
                  flow_stats        : obj.flow_stats,
                  table_stats       : obj.table_stats,
                  port_stats        : obj.port_stats,
                  stp               : obj.stp,
                  reserved          : obj.reserved,
                  ip_reasm          : obj.ip_reasm,
                  queue_stats       : obj.queue_stats,
                  arp_match_ip      : obj.arp_match_ip,
                  output            : obj.output,
                  set_vlan_vid      : obj.set_vlan_vid,
                  set_vlan_pcp      : obj.set_vlan_pcp,
                  strip_vlan        : obj.strip_vlan,
                  set_dl_src        : obj.set_dl_src,
                  set_dl_dst        : obj.set_dl_dst,
                  set_nw_src        : obj.set_nw_src,
                  set_nw_dst        : obj.set_nw_dst,
                  set_nw_tos        : obj.set_nw_tos,
                  set_tp_src        : obj.set_tp_src,
                  set_tp_dst        : obj.set_tp_dst,
                  enqueue           : obj.enqueue
		}], function (err) {
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
