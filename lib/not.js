var util = require('util');
var Logical = require('./logical');

var Not = function (token, expr) {
  Logical.call(this, token, expr, expr);
};

util.inherits(Not, Logical);

Not.prototype.jumping = function (t, f) {
  this.expr2.jumping(f, t);
};

Not.prototype.toString = function () {
  return this.op.toString() + " " + this.expr2.toString();
};

module.exports = Not;
