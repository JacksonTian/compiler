'use strict';

var util = require('util');
var Array = require('./array');
var Stmt = require('./stmt');
var Type = require('./type');

var SetElem = function (access, expr) {
  this.array = access.array;
  this.index = access.index;
  this.expr = expr;
  if (!this.check(access.type, expr.type)) {
    this.error('type error');
  }
};

util.inherits(SetElem, Stmt);

SetElem.prototype.check = function (type1, type2) {
  if ( type1 instanceof Array || type2 instanceof Array ) {
    return null;
  } else if (type1 === type2) {
    return type2;
  } else if (Type.numeric(type1) && Type.numeric(type2) ) {
    return type2;
  } else {
    return null;
  }
};

SetElem.prototype.gen = function (b, a) {
  var s1 = this.index.reduce().toString();
  var s2 = this.expr.reduce().toString();
  this.emit(this.array.toString() + " [ " + s1 + " ] = " + s2);
};

module.exports = SetElem;
