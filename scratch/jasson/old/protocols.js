
var Field = {
  name : "",
  type : "",
  size : Integer
};

function Field(name, type, size, initial) {
  this.name = name;
  this.type = type;
  this.size = size;
  this.initial = initial;
}

var Ethernet = {
  src : new Field("src", "byte", 6, "00:01:02:03:04:05"),
  dst: new Field("dst", "byte", 6, "00:01:02:03:04:05"),
  type : new Field("type", "byte", 2, 0),
  payload : new Field("payload", "vector(byte)"),
  crc : new Field("crc", "byte", 4, 0)
};

for(var key in Ethernet) {
  console.log(key);
}
