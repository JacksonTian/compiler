var Expr = require('./expr');
var Word = require('./word');
var util = require('util');

var Temp = function (type) {
  Expr.call(this, Word.temp, type);
  this.number = ++Temp.count;
};

Temp.count = 0;
util.inherits(Temp, Expr);

Temp.prototype.toString = function () {
  return "t" + this.number;
};

module.exports = Temp;
