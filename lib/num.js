var util = require('util');
var Token = require('./token');
var Tag = require('./tag');

var Num = function (value) {
  Token.call(this, Tag.NUM);
  this.value = value;
};

util.inherits(Num, Token);

Num.prototype.toString = function () {
  return "" + this.value;
};

module.exports = Num;
