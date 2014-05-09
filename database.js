
var orm = require('orm');

exports.connect = function(config, next) {
  orm.connect(config, function(err, db) {
    if(err) {
      console.log('Database connection failed');
      console.log(err.toString());
      return err;
    } else {
      console.log('Connected to database: %s@%s/%s',
                    config.user, config.host, config.database);
      return next(db);
    }
  });
}

exports.define = function(db, models, target) {
  for(var model in models) {
    target[model] = db.define(model, models[model]);
    console.log('Defing db model: %s', model);
  }
}

