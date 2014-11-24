var util = require('util');
var Op = require('./op');
var Tag = require('./tag');
var Word = require('./word');

var Access = function (id, expr, type) {
  Op.call(this, new Word("[]", Tag.INDEX), type);
  this.array = id;
  this.index = expr;
};

util.inherits(Access, Op);

Access.prototype.gen = function () {
  return new Access(this.array, this.index.reduce(), this.type);
};

Access.prototype.jumping = function (t, f) {
  this.emitjumps(this.reduce().toString(), t, f);
};

Access.prototype.toString = function () {
  return this.array.toString() + " [ " + this.index.toString() + " ]";
};

module.exports = Access;
