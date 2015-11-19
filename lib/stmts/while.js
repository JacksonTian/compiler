var Stmt = require('./stmt');
var Type = require('./type');
var util = require('util');

var While = function () {
  this.expr = null;
  this.stmt = null;
};

util.inherits(While, Stmt);

While.prototype.init = function (expr, stmt) {
  this.expr = expr;
  this.stmt = stmt;
  if (expr.type !== Type.Bool) {
    expr.error("boolean required in while");
  }
};

While.prototype.gen = function (b, a) {
  this.after = a;                // save label a
  this.expr.jumping(0, a);
  var label = this.newlabel();   // label for stmt
  this.emitlabel(label);
  this.stmt.gen(label, b);
  this.emit("goto L" + b);
};

module.exports = While;
