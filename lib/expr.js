'use strict';

var Node = require('./node');
var util = require('util');

var Expr = function (token, type) {
  this.op = token;
  this.type = type;
};

util.inherits(Expr, Node);

Expr.prototype.gen = function () {
  return this;
};

Expr.prototype.reduce = function () {
  return this;
};

Expr.prototype.jumping = function (t, f) {
  this.emitjumps(this.toString(), t, f);
};

Expr.prototype.emitjumps = function (test, t, f) {
  if (t !== 0 && f !== 0 ) {
    this.emit("if " + test + " goto L" + t);
    this.emit("goto L" + f);
  } else if (t !== 0) {
    this.emit("if " + test + " goto L" + t);
  } else if (f !== 0) {
    this.emit("iffalse " + test + " goto L" + f);
  }
};

Expr.prototype.toString = function () {
  return this.op.toString();
};

module.exports = Expr;
