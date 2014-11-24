var util = require('util');
var Logical = require('./logical');

var And = function (token, expr1, expr2) {
  Logical.call(this, token, expr1, expr2);
};

util.inherits(And, Logical);

And.prototype.jumping = function (t, f) {
  var label = (f !== 0 ? f : this.newlabel());
  this.expr1.jumping(0, label);
  this.expr2.jumping(t,f);
  if (f === 0) {
    this.emitlabel(label);
  }
};

module.exports = And;
