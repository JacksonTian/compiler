'use strict';

const Stmt = require('./stmt');

class Seq extends Stmt {
  constructor(line, stmt1, stmt2) {
    super(line);
    this.stmt1 = stmt1;
    this.stmt2 = stmt2;
  }

  gen(b, a) {
    if (this.stmt1 === Stmt.Null) {
      this.stmt2.gen(b, a);
    } else if (this.stmt2 === Stmt.Null) {
      this.stmt1.gen(b, a);
    } else {
      var label = this.newlabel();
      this.stmt1.gen(b,label);
      this.emitlabel(label);
      this.stmt2.gen(label,a);
    }
  }
}

module.exports = Seq;
