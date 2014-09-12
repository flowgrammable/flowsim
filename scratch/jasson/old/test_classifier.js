var classifier = require('./classifier');

var key = parseInt('0a01020a', 16);
var value = parseInt('0a000000', 16);
var mask = parseInt('ff000000', 16);

var flow = new classifier.Flow([value], [mask], 1);
var policy = flow.match([key]);

