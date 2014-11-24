var Expr = require('./expr');
var util = require('util');
var Type = require('./type');
var Temp = require('./temp');

var Logical = function (token, expr1, expr2) {
  Expr.call(this, token, null);
  this.expr1 = expr1;
  this.expr2 = expr2;
  this.type = this.check(expr1.type, expr2.type);
  if (!this.type) {
    this.error('type error');
  }
};
util.inherits(Logical, Expr);

Logical.prototype.check = function (type1, type2) {
  if (type1 === Type.Bool && type2 === Type.Bool ) {
    return Type.Bool;
  } else {
    return null;
  }
};

Logical.prototype.gen = function () {
  var f = this.newlabel();
  var a = this.newlabel();
  var temp = new Temp(this.type);
  this.jumping(0,f);
  this.emit(temp.toString() + " = true");
  this.emit("goto L" + a);
  this.emitlabel(f);
  this.emit(temp.toString() + " = false");
  this.emitlabel(a);
  return temp;
};

Logical.prototype.toString = function () {
  return this.expr1.toString() + " " + this.op.toString() + " " + this.expr2.toString();
};

module.exports = Logical;
