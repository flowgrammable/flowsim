
/**
 * @module subscriber
 */

(/** @lends module:subscriber */function(){

var sequelize = require('sequelize');

module.exports = {
  name: 'session',
	table: {
    key: sequelize.UUIDV4,
	  // begin_time: Seq.DATE,
    timeout: sequelize.BIGINT
    // ip: Seq.STRING,
    // status: Seq.STRING    
	},
	relations: {
    belongsTo: { relative: 'subscriber', options: { as: 'Subscriber' } }
	},
	options: {
		timestamps: false,
		underscored: true,
		tableName: 'session'
	}
};

})();

