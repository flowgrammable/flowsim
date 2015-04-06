
var ops = require('./operations');

// Valid set construction
ops.set();
ops.set(1);
ops.set([1]);
ops.set(1, 2, 3, 4);
ops.set([1, 2, 3, 4);

// Valid map construction
ops.map();
ops.map(
  ops.pair(x, y),
  ops.pair(x, y)
);

ops.map([
  ops.pair(x, y),
  ops.pair(x, y)]
);

// insert example
ops.insert({
  table: "Open_vSwitch",
  row: {
    bridges: ops.set(
      'br0', 'br1', 'br2'
    )
  }
});

ops.select({
  table: "bridge",
  where: [
    includes("protocols", ops.set("OpenFlow14", "OpenFlow15"))
  ],
  columns: [
    "name",
    "ports",
    "controllers"
  ]
});


