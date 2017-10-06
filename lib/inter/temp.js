'use strict';

const Expr = require('./expr');
const Word = require('../lexer/word');

class Temp extends Expr {
  constructor(line, type) {
    super(line, Word.temp, type);
    this.number = ++Temp.count;
  }

  toString() {
    return 't' + this.number;
  }
}

Temp.count = 0;

module.exports = Temp;
