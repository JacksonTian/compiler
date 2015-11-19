'use strict';

var Stmt = require('./stmt');
var util = require('util');

var Seq = function (stmt1, stmt2) {
  this.stmt1 = stmt1;
  this.stmt2 = stmt2;
};
util.inherits(Seq, Stmt);

Seq.prototype.gen = function (b, a) {
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
};

module.exports = Seq;
