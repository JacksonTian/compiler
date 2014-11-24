var Op = require('./op');
var Type = require('./type');
var util = require('util');

var Arith = function (token, expr1, expr2) {
  Op.call(this, token, null);
  this.expr1 = expr1;
  this.expr2 = expr2;
  this.type = Type.max(expr1.type, expr2.type);
  if (this.type == null ) {
    this.error("type error");
  }
};

util.inherits(Arith, Op);

Arith.prototype.gen = function () {
  return new Arith(this.op, this.expr1.reduce(), this.expr2.reduce());
};

Arith.prototype.toString = function () {
  return this.expr1.toString() + " " + this.op.toString() + " " + this.expr2.toString();
};

module.exports = Arith;
