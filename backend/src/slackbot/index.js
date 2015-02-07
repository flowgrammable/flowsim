( function(){

var request = require('request');

var name = 'slackbot';

function Slackbot(config){
	this.config = config[name];
	this.requestConfig = {
		uri: this.config.slackUrl,
		method: 'POST',
		json: {
			'username': this.config.username,
			'text': '',
			'icon_emoji': this.config.icon
		}
	};
}
exports.Slackbot = Slackbot;

Slackbot.prototype.postEvent = function(type, args){
	var msg;
	switch(type){
		case 'registration':
			msg = registrationMsg(args);
			this.requestConfig.json.text = msg;
			postToSlack(this.requestConfig, msg);
			break;
		default:
			break;
	}
};

function registrationMsg(args){
	return 'User Registration - ' + args.email;
}

function postToSlack(config){
	request(config, function(error, response, body){
		if(err){
			console.log('could not post to slackbot', err);
		}
	});
}

})();
