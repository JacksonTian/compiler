'use strict';

var Stmt = require('./stmt');
var Type = require('./type');

var util = require('util');

var Set = function (id, expr) {
  this.id = id;
  this.expr = expr;
  if (!this.check(id.type, expr.type)) {
    this.error("type error");
  }
};

util.inherits(Set, Stmt);

Set.prototype.check = function (type1, type2) {
  return type2;
  if (Type.numeric(type1) && Type.numeric(type2) ) {
    return type2;
  } else if (type1 == Type.Bool && type2 == Type.Bool ) {
    return type2;
  } else {
    return null;
  }
};

Set.prototype.gen = function () {
  this.emit(this.id.toString() + " = " + this.expr.gen().toString());
};

module.exports = Set;
