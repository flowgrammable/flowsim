var ethernet = require('./ethernet');

try {
  var hdr = new ethernet.Header('00:11:22:33:44:55', 'ff:ff:ff:ff:ff:ff', ethernet.IPv4);
  console.log(hdr.toString());
} catch(err) {
  console.log("Error: " + err);
}
