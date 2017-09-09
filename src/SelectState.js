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
  this.textNum = 0;
}

SlState.prototype.export = function() {
  let s = {
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
    textNum: this.textNum,
    toString() {
      let str = '';
      Object.keys(this).forEach(key => {
        if (key.endsWith('s')) {
          str += `${key}:[ ${this[key].toString()}];`;
        } else {
          str += `${key}:${this[key]};`;
        }
      })
      return str;
    }
  }
  Reflect.defineProperty(s, 'toString', {enumerable: false})
  return s;
}

module.exports = SlState;
