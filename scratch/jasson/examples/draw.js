
var width = 400;
var height = 300;

var dataset = [
  { 
    protocol: "Ethernet",
    bytes: 14,
  }, {
    protocol: "VLAN",
    bytes: 4
  }, {
    protocol: "VLAN",
    bytes: 4
  }, {
    protocol: "IPv4",
    bytes: 20
  }, {
    protocol: "TCP",
    bytes: 20
  }
  // xPos
  // xWidth
  // color
  // byte text
  // title text
];

function update(d) {
  var total = 0;
  var i;
  var inc = 1/d.length;
  var pos = 0;
  for(i=0; i<d.length; ++i) {
    total += d[i].bytes;
    d[i].x = pos;
    d[i].ratio = inc;
    pos += inc;
  }
}

var xScale = d3.scale.linear()
  .domain([0, 1])
  .range([0+5, width-5]);

var yScale = d3.scale.linear()
  .domain([0, 100])
  .range([0+5, height-5]);

var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var rects = svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", function(d) {
    return xScale(d.x_pos);
  })
  .attr("y", yScale(100))
  .attr("width", function(d) {
    return xScale(d.ratio);
  })
  .attr("height", yScale(20));

var texts = svg.selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text(function(d) {
    return d.protocol;
  })
  .attr("x", )
  .attr("y", );
