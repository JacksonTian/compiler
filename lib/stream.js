'use strict';

var Stream = function (source) {
  this.source = source;
  this.pos = -1;
};

Stream.prototype.read = function () {
  this.pos = this.pos + 1;
  return this.source[this.pos];
};

Stream.prototype.getLines = function () {
  return this.source.substring(this.pos, this.pos + 100);
};

module.exports = Stream;
