'use strict';

/**
 * this state is editor's select_state
 * @constructor
 */
function SlState() {
  this.b = true;
  this.u = true;
  this.d = true;
  this.i = true;
  this.size = new Set();
  this.justify = new Set();
  this.color = new Set();
}

SlState.prototype.export = function () {
  var s = {
    allB: this.b,
    allU: this.u,
    allD: this.d,
    allI: this.i,
    allSize: this.size.size == 1,
    allColor: this.color.size == 1,
    allJustify: this.justify.size == 1,
    sizes: Array.from(this.size),
    colors: Array.from(this.color),
    justifys: Array.from(this.justify),
    toString: function toString() {
      var _this = this;

      var str = '';
      Object.keys(this).forEach(function (key) {
        if (key.endsWith('s')) {
          str += key + ':[' + _this[key].toString() + '];';
        } else {
          str += key + ':' + _this[key] + ';';
        }
      });
      return str;
    }
  };
  Object.defineProperty(s, 'toString', { enumerable: false });
  return s;
};

module.exports = SlState;