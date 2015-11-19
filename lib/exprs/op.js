var Expr = require('./expr');
var Temp = require('./temp');
var util = require('util');

var Op = function (token, type) {
  Expr.call(this, token, type);
};

util.inherits(Op, Expr);

Op.prototype.reduce = function () {
  var x = this.gen();
  var t = new Temp(this.type);
  this.emit(t.toString() + " = " + x.toString());
  return t;
};

module.exports = Op;
