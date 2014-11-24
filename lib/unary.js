var Op = require('./op');
var Type = require('./type');
var util = require('util');

var Unary = function (token, expr) {
  Op.call(this, token, null);
  this.expr = expr;
  this.type = Type.max(Type.Int, expr.type);
  if (!this.type) {
    this.error('type error');
  }
};
util.inherits(Unary, Op);

Unary.prototype.gen = function () {
  return new Unary(this.op, this.expr.reduce());
};

Unary.prototype.toString = function () {
  return this.op.toString() + " " + this.expr.toString();
};

module.exports = Unary;
