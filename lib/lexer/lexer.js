'use strict';

const Word = require('./word');
const Tag = require('./tag');
const Token = require('./token');
const Num = require('./num');
const Real = require('./real');

const Type = require('../symbols/type');

function isDigit (c) {
  return '0123456789'.indexOf(c) !== -1;
}

function isLetter (c) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return chars.indexOf(c) !== -1;
}

function isLetterOrDigit (c) {
  return isDigit(c) || isLetter(c);
}

class Lexer {
  constructor(stream) {
    this.peek = ' ';
    this.words = {};
    this.stream = stream;
    this.line = 1;

    // reserve words
    this.reserve(new Word('if', Tag.IF));
    this.reserve(new Word('else',  Tag.ELSE));
    this.reserve(new Word('while', Tag.WHILE));
    this.reserve(new Word('do',    Tag.DO));
    this.reserve(new Word('break', Tag.BREAK));
    this.reserve(new Word('var', Tag.BASIC));

    this.reserve(Word.True);
    this.reserve(Word.False);

    this.reserve(Type.Int);
    this.reserve(Type.Char);
    this.reserve(Type.Bool);
    this.reserve(Type.Float);
  }

  reserve(word) {
    this.words[word.lexeme] = word;
  }

  readch() {
    this.peek = this.stream.read();
  }

  match(c) {
    this.readch();
    if (this.peek !== c) {
      return false;
    }
    this.peek = ' ';
    return true;
  }

  scan() {
    for ( ; ; this.readch() ) {
      if (this.peek === ' ' || this.peek === '\t' ) {
        continue;
      } else if (this.peek === '\n' ) {
        this.line = this.line + 1;
      } else {
        break;
      }
    }
    switch (this.peek) {
    case '&':
      if (this.match('&')){
        return Word.and;
      }
      return new Token('&');

    case '|':
      if (this.match('|')) {
        return Word.or;
      }
      return new Token('|');

    case '=':
      if (this.match('=')) {
        return Word.eq;
      }
      return new Token('=');

    case '!':
      if (this.match('=')) {
        return Word.ne;
      }
      return new Token('!');

    case '<':
      if (this.match('=')) {
        return Word.le;
      }
      return new Token('<');

    case '>':
      if (this.match('=')) {
        return Word.ge;
      }
      return new Token('>');
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
  }
}

module.exports = Lexer;
