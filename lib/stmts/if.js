var util = require('util');
var Stmt = require('./stmt');
var Type = require('./type');

var If = function (expr, stmt) {
  this.expr = expr;
  this.stmt = stmt;

  if (expr.type !== Type.Bool ) {
    expr.error("boolean required in if");
  }
};

util.inherits(If, Stmt);

If.prototype.gen = function (b, a) {
  var label = this.newlabel(); // label for the code for stmt
  this.expr.jumping(0, a);     // fall through on true, goto a on false
  this.emitlabel(label);
  this.stmt.gen(label, a);
};

module.exports = If;
