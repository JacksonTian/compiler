var Word = require('./word');
var Tag = require('./tag');
var Type = require('./type');
var Token = require('./token');
var Num = require('./num');
var Real = require('./real');

var Lexer = function (stream) {
  this.peek = ' ';
  this.words = {};
  this.stream = stream;
  this.line = 1;
  // reserve words
  this.reserve(new Word('if', Tag.IF));
  this.reserve(new Word("else",  Tag.ELSE));
  this.reserve(new Word("while", Tag.WHILE));
  this.reserve(new Word("do",    Tag.DO));
  this.reserve(new Word("break", Tag.BREAK));
  this.reserve(new Word("var", Tag.BASIC));

  this.reserve(Word.True);
  this.reserve(Word.False);

  this.reserve(Type.Int);
  this.reserve(Type.Char);
  this.reserve(Type.Bool);
  this.reserve(Type.Float);
};

Lexer.prototype.reserve = function (word) {
  this.words[word.lexeme] = word;
};

Lexer.prototype.readch = function () {
  this.peek = this.stream.read();
};

Lexer.prototype.match = function (c) {
  this.readch();
  if (this.peek !== c) {
    return false;
  }
  this.peek = ' ';
  return true;
};

var isDigit = function (c) {
  return '0123456789'.indexOf(c) !== -1;
};

var isLetter = function (c) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return chars.indexOf(c) !== -1;
};

var isLetterOrDigit = function (c) {
  return isDigit(c) || isLetter(c);
};

Lexer.prototype.scan = function () {
  for ( ; ; this.readch() ) {
    if (this.peek === ' ' || this.peek === '\t' ) {
      continue;
    } else if (this.peek === '\n' ) {
      Lexer.line = Lexer.line + 1;
    } else {
      break;
    }
  }
  switch (this.peek) {
  case '&':
    if (this.match('&')){
      return Word.and;
    } else {
      return new Token('&');
    }
  case '|':
    if (this.match('|')) {
      return Word.or;
    } else {
      return new Token('|');
    }
  case '=':
    if (this.match('=')) {
      return Word.eq;
    } else {
      return new Token('=');
    }
  case '!':
    if (this.match('=')) {
      return Word.ne;
    } else {
      return new Token('!');
    }
  case '<':
    if (this.match('=')) {
      return Word.le;
    } else {
      return new Token('<');
    }
  case '>':
    if (this.match('=')) {
      return Word.ge;
    } else {
      return new Token('>');
    }
  }
  if (isDigit(this.peek)) {
    var v = 0;
    do {
      v = 10 * v + parseInt(this.peek, 10);
      this.readch();
    } while (isDigit(this.peek));
    if (this.peek !== '.' ) {
      return new Num(v);
    }
    var x = v;
    var d = 10;
    for (;;) {
      this.readch();
        if (!isDigit(this.peek)) {
          break;
        }
        x = x + parseInt(this.peek, 10) / d;
        d = d * 10;
     }
     return new Real(x);
  }
  if (isLetter(this.peek)) {
    var str = '';
    do {
      str += this.peek;
      this.readch();
    } while (isLetterOrDigit(this.peek));
    var word = this.words[str];
    if (word) {
      return word;
    }
    word = new Word(str, Tag.ID);
    this.words[str] = word;
    return word;
  }

  var tok = new Token(this.peek);
  this.peek = ' ';
  return tok;
};

module.exports = Lexer;
