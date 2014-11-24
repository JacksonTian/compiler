var Logical = require('./logical');
var util = require('util');
var Type = require('./type');
var Array = require('./array');

var Rel = function (token, expr1, expr2) {
  Logical.call(this, token, expr1, expr2);
};

util.inherits(Rel, Logical);

Rel.prototype.check = function (type1, type2) {
  if (type1 instanceof Array || type2 instanceof Array) {
    return null;
  } else if ( type1 === type2 ) {
    return Type.Bool;
  } else {
    return null;
  }
};

Rel.prototype.jumping = function (t, f) {
  var a = this.expr1.reduce();
  var b = this.expr2.reduce();
  var test = a.toString() + " " + this.op.toString() + " " + b.toString();
  this.emitjumps(test, t, f);
};

module.exports = Rel;
