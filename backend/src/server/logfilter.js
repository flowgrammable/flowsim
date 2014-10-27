
/**
 * @module server
 */

(/** @lends module:server */function(){
var _ = require('underscore');
var assert = require('assert');
var HttpError = require('restify').HttpError;
var bunyan = require('bunyan');

// Fields to filter out of body
var filterBodyFields = [
  'password',
  'oldPassword',
  'newPassword',
  'x-access-token'];

var filterHeaderFields = [
  'x-access-token'
];




function responseLogger(options) {
    assert(options, 'options');
    assert(options.log, 'options.log');

    var log = options.log.child({
        audit: true,
        serializers: {
            err: bunyan.stdSerializers.err,
            req: function auditRequestSerializer(req) {
                if (!req)
                    return (false);

                var timers = {};
                (req.timers || []).forEach(function (time) {
                    var t = time.time;
                    var _t = Math.floor((1000000 * t[0]) +
                        (t[1] / 1000));
                    timers[time.name] = _t;
                });
                // filter body fields
                _.each(filterBodyFields, function(field){
                  if(req.body){
                    if(req.body[field]){
                      req.body[field] = 'FILTERED';
                    }
                  }
                });
                // filter header fields
                _.each(filterHeaderFields, function(headerField){
                  if(req.headers[headerField]){
                    req.headers[headerField] = 'FILTERED';
                  }
                });
                return ({
                    method: req.method,
                    url: req.url,
                    headers: req.headers,
                    httpVersion: req.httpVersion,
                    trailers: req.trailers,
                    version: req.version(),
                    body: options.body === true ?
                        req.body : undefined,
                    timers: timers
                });
            },
            res: function auditResponseSerializer(res) {
                if (!res)
                    return (false);

                var body;
                if (options.body === true) {
                    if (res._body instanceof HttpError) {
                        body = res._body.body;
                    } else {
                        body = res._body;
                        _.each(filterBodyFields, function(bodyField){
                          if(body){
                            if(body.value){
                              if(body.value[bodyField]){
                                body.value[bodyField] = 'FILTERED';
                              }
                            }
                          }
                        });
                    }
                }

                return ({
                    statusCode: res.statusCode,
                    headers: res._headers,
                    trailer: res._trailer || false,
                    body: body
                });
            }
        }
    });

    function audit(req, res, route, err) {
        var latency = res.get('Response-Time');
        if (typeof (latency) !== 'number')
            latency = Date.now() - req._time;
        var obj = {
            remoteAddress: req.connection.remoteAddress,
            remotePort: req.connection.remotePort,
            req_id: req.getId(),
            req: req,
            res: res,
            err: err,
            latency: latency,
            secure: req.secure,
            _audit: true
        };

        log.info(obj, 'handled: %d', res.statusCode);

        return (true);
    }

    return (audit);
}

exports.responseLogger = responseLogger;

function requestLogger(options){
  assert(options, 'options');
  assert(options.log, 'options.log');

  var log = options.log.child({
      audit: true,
      serializers: {
          err: bunyan.stdSerializers.err,
          req: function requestSerializer(req) {
              if (!req)
                  return (false);
              // filter body fields
              _.each(filterBodyFields, function(field){
                if(req.body){
                  if(req.body[field]){
                    req.body[field] = 'FILTERED';
                  }
                }
              });
              // filter header fields
              _.each(filterHeaderFields, function(headerField){
                if(req.headers[headerField]){
                  req.headers[headerField] = 'FILTERED';
                }
              });
              return ({
                  method: req.method,
                  url: req.url,
                  headers: req.headers,
                  httpVersion: req.httpVersion,
                  trailers: req.trailers,
                  version: req.version(),
                  body: options.body === true ?
                      req.body : undefined
              });
          }
      }
  });

  function reqLog(req, res, next){
    var obj = {
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort,
        req_id: req.getId(),
        req: req,
    };

    log.info(obj);

    next();
    return (true);
  }
  return (reqLog);
}

exports.requestLogger = requestLogger;

})();
