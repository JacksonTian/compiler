var util = require('util');
var Token = require('./token');
var Tag = require('./tag');

var Word = function (name, tag) {
  Token.call(this, tag);
  this.lexeme = name;
};

util.inherits(Word, Token);

Word.prototype.toString = function () {
  return this.lexeme;
};

Word.and = new Word("&&", Tag.AND);
Word.or = new Word("||", Tag.OR);
Word.eq = new Word("==", Tag.EQ);
Word.ne = new Word("!=", Tag.NE);
Word.le = new Word("<=", Tag.LE);
Word.ge = new Word(">=", Tag.GE);
Word.minus = new Word("minus", Tag.MINUS);
Word.True = new Word("true", Tag.TRUE);
Word.False = new Word("false", Tag.FALSE);
Word.temp = new Word("t", Tag.TEMP);

module.exports = Word;
