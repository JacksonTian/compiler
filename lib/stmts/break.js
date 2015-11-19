var util = require('util');
var Stmt = require('./stmt');

var Break = function () {
  if (Stmt.Enclosing == Stmt.Null) {
    this.error('unenclosed break');
  }
  this.stmt = Stmt.Enclosing;
};

util.inherits(Break, Stmt);

Break.prototype.gen = function (b, a) {
  this.emit("goto L" + this.stmt.after);
};

module.exports = Break;
