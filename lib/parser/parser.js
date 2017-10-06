'use strict';

// symbols
const Env = require('../symbols/env');
const Type = require('../symbols/type');
const Array = require('../symbols/array');

// lexer
const Tag = require('../lexer/tag');
const Word = require('../lexer/word');
const Token = require('../lexer/token');

// inter
const Seq = require('../inter/seq');
const Id = require('../inter/id');
const Constant = require('../inter/constant');
const Access = require('../inter/access');
const Stmt = require('../inter/stmt');
const Set = require('../inter/set');
const Arith = require('../inter/arith');
const Unary = require('../inter/unary');
const While = require('../inter/while');
const Rel = require('../inter/rel');
const Not = require('../inter/not');
const Else = require('../inter/else');
const Or = require('../inter/or');
const And = require('../inter/and');
const Do = require('../inter/do');
const If = require('../inter/if');
const Break = require('../inter/break');
const SetElem = require('../inter/set_elem');

class Parser {
  constructor(lex) {
    this.lex = lex;
    this.top = null;
    this.look = null;
    this.used = 0;
    this.move();
  }

  get line() {
    return this.lex.line;
  }

  move() {
    this.look = this.lex.scan();
  }

  program() {
    var stmt = this.block();
    var begin = stmt.newlabel();
    var after = stmt.newlabel();
    stmt.emitlabel(begin);
    stmt.gen(begin, after);
    stmt.emitlabel(after);
  }

  // block -> {
  //  decls
  //  stmts
  // }
  block() {
    this.match('{');
    var savedEnv = this.top;
    this.top = new Env(this.top);
    this.decls();
    var s = this.stmts();
    this.match('}');
    this.top = savedEnv;
    return s;
  }

  match(token) {
    if (this.look.tag === token) {
      this.move();
    } else {
      this.error('syntax error');
    }
  }

  decls() {
    while (this.look.tag === Tag.BASIC) {   // D -> type ID ;
      var p = this.type();
      var tok = this.look;
      this.match(Tag.ID);
      this.match(';');
      var id = new Id(this.line, tok, p, this.used);
      this.top.put(tok, id);
      this.used = this.used + p.width;
    }
  }

  stmts() {
    if (this.look.tag === '}' ) {
      return Stmt.Null;
    }
    return new Seq(this.line, this.stmt(), this.stmts());
  }

  stmt() {
    var x;
    var s1, s2;
    var savedStmt; // save enclosing loop for breaks

    switch (this.look.tag) {

    case ';':
      this.move();
      return Stmt.Null;

    case Tag.IF:
      this.match(Tag.IF);
      this.match('(');
      x = this.bool();
      this.match(')');
      s1 = this.stmt();
      if (this.look.tag !== Tag.ELSE) {
        return new If(this.line, x, s1);
      }
      this.match(Tag.ELSE);
      s2 = this.stmt();
      return new Else(this.line, x, s1, s2);

    case Tag.WHILE:
      var whilenode = new While(this.line);
      savedStmt = Stmt.Enclosing; Stmt.Enclosing = whilenode;
      this.match(Tag.WHILE);
      this.match('(');
      x = this.bool();
      this.match(')');
      s1 = this.stmt();
      whilenode.init(x, s1);
      Stmt.Enclosing = savedStmt;  // reset Stmt.Enclosing
      return whilenode;

    case Tag.DO:
      var donode = new Do(this.line);
      savedStmt = Stmt.Enclosing;
      Stmt.Enclosing = donode;
      this.match(Tag.DO);
      s1 = this.stmt();
      this.match(Tag.WHILE);
      this.match('(');
      x = this.bool();
      this.match(')');
      this.match(';');
      donode.init(s1, x);
      Stmt.Enclosing = savedStmt;  // reset Stmt.Enclosing
      return donode;

    case Tag.BREAK:
      this.match(Tag.BREAK);
      this.match(';');
      return new Break(this.line);

    case '{':
      return this.block();

    default:
      return this.assign();
    }
  }

  assign() {
    var stmt;
    var t = this.look;
    this.match(Tag.ID);
    var id = this.top.get(t);
    if (!id) {
      this.error(t.toString() + ' undeclared');
    }

    if (this.look.tag === '=' ) {       // S -> id = E ;
      this.move();
      stmt = new Set(this.line, id, this.bool());
    } else {                        // S -> L = E ;
      var x = this.offset(id);
      this.match('=');
      stmt = new SetElem(this.line, x, this.bool());
    }
    this.match(';');
    return stmt;
  }

  error(str) {
    var err = new Error();
    err.message = 'near line ' + this.lex.line + ':\n' + this.lex.stream.getLines() + '\n' + str;
    throw err;
  }

  type() {
    var p = this.look;            // expect look.tag == Tag.BASIC
    this.match(Tag.BASIC);
    if (this.look.tag !== '[') {
      return p; // T -> basic
    }
    return this.dims(p); // return array type
  }

  bool() {
    var x = this.join();
    while (this.look.tag === Tag.OR) {
      var tok = this.look;
      this.move();
      x = new Or(this.line, tok, x, this.join());
    }
    return x;
  }

  join() {
    var x = this.equality();
    while (this.look.tag === Tag.AND) {
      var tok = this.look;
      this.move();
      x = new And(this.line, tok, x, this.equality());
    }
    return x;
  }

  equality() {
    var x = this.rel();
    while (this.look.tag === Tag.EQ || this.look.tag === Tag.NE ) {
      var tok = this.look;
      this.move();
      x = new Rel(this.line, tok, x, this.rel());
    }
    return x;
  }

  rel() {
    var x = this.expr();
    switch (this.look.tag) {
    case '<':
    case Tag.LE:
    case Tag.GE:
    case '>':
      var tok = this.look;
      this.move();
      return new Rel(this.line, tok, x, this.expr());
    default:
      return x;
    }
  }

  expr() {
    var x = this.term();
    while (this.look.tag === '+' || this.look.tag === '-' ) {
      var tok = this.look;
      this.move();
      x = new Arith(this.line, tok, x, this.term());
    }
    return x;
  }

  term() {
    var x = this.unary();
    while (this.look.tag === '*' || this.look.tag === '/' ) {
      var tok = this.look;
      this.move();
      x = new Arith(this.line, tok, x, this.unary());
    }
    return x;
  }

  unary() {
    if (this.look.tag === '-' ) {
      this.move();
      return new Unary(this.line, Word.minus, this.unary());
    } else if (this.look.tag === '!') {
      var tok = this.look;
      this.move();
      return new Not(this.line, tok, this.unary());
    }
    return this.factor();
  }

  factor() {
    var x = null;
    switch (this.look.tag ) {
    case '(':
      this.move();
      x = this.bool();
      this.match(')');
      return x;
    case Tag.NUM:
      x = new Constant(this.line, this.look, Type.Int);
      this.move();
      return x;
    case Tag.REAL:
      x = new Constant(this.line, this.look, Type.Float);
      this.move();
      return x;
    case Tag.TRUE:
      x = Constant.True;
      this.move();
      return x;
    case Tag.FALSE:
      x = Constant.False;
      this.move();
      return x;
    default:
      this.error('syntax error');
      return x;
    case Tag.ID:
      var id = this.top.get(this.look);
      if (!id) {
        this.error(this.look.toString() + ' undeclared');
      }
      this.move();
      if (this.look.tag !== '[' ) {
        return id;
      }
      return this.offset(id);

    }
  }

  dims(type) {
    this.match('[');
    var tok = this.look;
    this.match(Tag.NUM);
    this.match(']');
    if (this.look.tag === '[') {
      type = this.dims(type);
    }
    return new Array(this.line, tok.value, type);
  }

  offset(a) {   // I -> [E] | [E] I
    var i;
    var w;
    var t1, t2;
    var loc;  // inherit id

    var type = a.type;
    this.match('[');
    i = this.bool();
    this.match(']');     // first index, I -> [ E ]
    type = type.of;
    w = new Constant(this.line, type.width);
    t1 = new Arith(this.line, new Token('*'), i, w);
    loc = t1;
    while (this.look.tag === '[') {      // multi-dimensional I -> [ E ] I
      this.match('[');
      i = this.bool();
      this.match(']');
      type = type.of;
      w = new Constant(this.line, type.width);
      t1 = new Arith(this.line, new Token('*'), i, w);
      t2 = new Arith(this.line, new Token('+'), loc, t1);
      loc = t2;
    }

    return new Access(this.line, a, loc, type);
  }
}

module.exports = Parser;
