'use strict';

const Type = require('../symbols/type');

const Word = require('../lexer/word');
const Num = require('../lexer/num');

const Expr = require('./expr');

class Constant extends Expr {
  constructor(line, token, type) {
    if (typeof type === 'undefined') {
      token = new Num(token);
      type = Type.Int;
    }
    super(line, token, type);
  }

  jumping(t, f) {
    if (this === Constant.True && t !== 0) {
      this.emit('goto L' + t);
    } else if (this === Constant.False && f !== 0) {
      this.emit('goto L' + f);
    }
  }
}

Constant.True = new Constant(0, Word.True, Type.Bool);
Constant.False = new Constant(0, Word.False, Type.Bool);

module.exports = Constant;
