var Expr = require('./expr');
var Type = require('./type');
var Word = require('./word');
var Num = require('./num');
var util = require('util');

var Constant = function (token, type) {
  if (arguments.length === 2) {
    Expr.call(this, token, type);
  } else {
    Expr.call(this, new Num(token), Type.Int);
  }
};

util.inherits(Constant, Expr);

Constant.prototype.jumping = function (t, f) {
  if ( this === Constant.True && t !== 0 ) {
    this.emit("goto L" + t);
  } else if ( this === Constant.False && f !== 0) {
    this.emit("goto L" + f);
  }
};

Constant.True = new Constant(Word.True, Type.Bool);
Constant.False = new Constant(Word.False, Type.Bool);

module.exports = Constant;
