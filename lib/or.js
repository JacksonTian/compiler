var Logical = require('./logical');
var util = require('util');

var Or = function (token, expr1, expr2) {
  Logical.call(this, token, expr1, expr2);
};
util.inherits(Or, Logical);

Or.prototype.jumping = function (t, f) {
  var label = (t !== 0 ? t : this.newlabel());
  this.expr1.jumping(label, 0);
  this.expr2.jumping(t,f);
  if (t === 0 ) {
    this.emitlabel(label);
  }
};

module.exports = Or;
