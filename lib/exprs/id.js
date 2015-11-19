'use strict';

var Expr = require('./expr');
var util = require('util');

var Id = function (id, type, offset) {
  Expr.call(this, id, type);
  this.offset = offset;
};

util.inherits(Id, Expr);

module.exports = Id;
