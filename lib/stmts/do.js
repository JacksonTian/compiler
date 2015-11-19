var util = require('util');
var Stmt = require('./stmt');
var Type = require('./type');

var Do = function () {
  this.expr = null;
  this.stmt = null;
};

util.inherits(Do, Stmt);

Do.prototype.init = function (stmt, expr) {
  this.expr = expr;
  this.stmt = stmt;
  if (expr.type !== Type.Bool) {
    expr.error("boolean required in do");
  }
};

Do.prototype.gen = function (b, a) {
  this.after = a;
  var label = this.newlabel();   // label for expr
  this.stmt.gen(b,label);
  this.emitlabel(label);
  this.expr.jumping(b,0);
};

module.exports = Do;
