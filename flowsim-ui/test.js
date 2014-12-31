var testString = "oldstring";

function Stringer(x){
  this.y = x;
}

var i = new Stringer(testString);
testString = "newstring"; 
console.log(testString);
console.log(i.y);
