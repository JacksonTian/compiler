'use strict';

const Token = require('./token');
const Tag = require('./tag');

class Word extends Token {
  constructor(name, tag) {
    super(tag);
    this.lexeme = name;
  }

  toString() {
    return this.lexeme;
  }
}

Word.and = new Word('&&', Tag.AND);
Word.or = new Word('||', Tag.OR);
Word.eq = new Word('==', Tag.EQ);
Word.ne = new Word('!=', Tag.NE);
Word.le = new Word('<=', Tag.LE);
Word.ge = new Word('>=', Tag.GE);
Word.minus = new Word('minus', Tag.MINUS);
Word.True = new Word('true', Tag.TRUE);
Word.False = new Word('false', Tag.FALSE);
Word.temp = new Word('t', Tag.TEMP);

module.exports = Word;
