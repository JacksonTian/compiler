var Type = require('./type');
var Tag = require('./tag');
var util = require('util');

var Array = function (size, type) {
  Type.call(this, '[]', Tag.INDEX, size * type.width);
  this.size = size;
  this.of = type;
};

util.inherits(Array, Tag);

Array.prototype.toString = function () {
  return "[" + this.size + "] " + this.of.toString();
};

module.exports = Array;
