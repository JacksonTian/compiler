'use strict';

const Tag = require('../lexer/tag');
const Word = require('../lexer/word');

const Op = require('./op');

class Access extends Op {
  constructor(line, id, expr, type) {
    super(line, new Word('[]', Tag.INDEX), type);
    this.array = id;
    this.index = expr;
  }

  gen() {
    return new Access(this.lexline, this.array, this.index.reduce(), this.type);
  }

  jumping(t, f) {
    this.emitjumps(this.reduce().toString(), t, f);
  }

  toString() {
    return this.array.toString() + ' [ ' + this.index.toString() + ' ]';
  }
}

module.exports = Access;
