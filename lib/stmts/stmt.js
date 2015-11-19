'use strict';

var Node = require('./node');
var util = require('util');

var Stmt = function () {};

util.inherits(Stmt, Node);

Stmt.Null = new Stmt();

Stmt.prototype.gen = function (b, a) {};

Stmt.prototype.after = 0;
Stmt.Enclosing = Stmt.Null;

module.exports = Stmt;
