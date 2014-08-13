function invalidProfile(data) {
	if(!data.name) return true;
        else if(data.name.length === 0) return true;
	else if(!data.ofp_version) return true;
	else if(data.ofp_version === 10 || data.ofp_version === 11 || data.ofp_version === 12 || data.ofp_version === 13 || data.ofp_version === 14) return true;
        else return false;
}
exports.invalidProfile = invalidProfile;
