var msg = require('./msg.js');

function invalidProfile(data) {
	if(!data.name) return msg.missingName;
        else if(data.name.length === 0) return msg.missingName;
	else if(!data.ofp_version) return msg.missingOfpVersion;
	else if(data.ofp_version === 10 || 
		data.ofp_version === 11 || 
		data.ofp_version === 12 || 
		data.ofp_version === 13 || 
		data.ofp_version === 14) return msg.missingOfpVersion;
        else return false;
}

function invalidProfileUpdate(data) {
	if(!data.name) return msg.missingName;
        else if(data.name.length === 0) return msg.missingName;
        else if(!data.ofp_version) return msg.missingOfpVersion;
        else if(data.ofp_version === 10 || 
		data.ofp_version === 11 || 
		data.ofp_version === 12 || 
		data.ofp_version === 13 || 
		data.ofp_version === 14) return msg.missingOfpVersion;
	else if(!data.id) return msg.missingId;
	else if(data.id.length === 0) return msg.missingId;
        else return false;
}
exports.invalidProfile = invalidProfile;
exports.invalidProfileUpdate = invalidProfileUpdate;
