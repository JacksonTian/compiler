var util = require('util');
var Token = require('./token');
var Tag = require('./tag');

var Real = function (value) {
  Token.call(this, Tag.REAL);
  this.value = value;
};

util.inherits(Real, Token);

Real.prototype.toString = function() {
  return "" + this.value;
};

module.exports = Real;
