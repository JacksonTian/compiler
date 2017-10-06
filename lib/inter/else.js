'use strict';

const Type = require('../symbols/type');
const Stmt = require('./stmt');

class Else extends Stmt {
  constructor(line, expr, stmt1, stmt2) {
    super(line);
    this.expr = expr;
    this.stmt1 = stmt1;
    this.stmt2 = stmt2;
    if (expr.type !== Type.Bool) {
      expr.error('boolean required in if');
    }
  }

  gen(b, a) {
    var label1 = this.newlabel();   // label1 for stmt1
    var label2 = this.newlabel();   // label2 for stmt2
    this.expr.jumping(0, label2);    // fall through to stmt1 on true
    this.emitlabel(label1);
    this.stmt1.gen(label1, a);
    this.emit('goto L' + a);
    this.emitlabel(label2);
    this.stmt2.gen(label2, a);
  }
}

module.exports = Else;
