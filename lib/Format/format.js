'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// import util from '../util';
function format(html) {
  var range = document.createRange();
  var frag = range.createContextualFragment(html);
  var changed = 0;
  [].concat(_toConsumableArray(frag.querySelectorAll('*'))).forEach(function (e) {
    var b = void 0,
        i = void 0,
        u = void 0,
        s = void 0;
    var replace = false;
    var elements = [];
    if (e.style.fontWeight) {
      var v = e.style.fontWeight;
      b = v.includes('bold') || (v | 0) > 400 ? elements.push(document.createElement('b')) : '';
      e.style.fontWeight = '';
    }
    if (e.style.fontStyle) {
      var _v = e.style.fontStyle;
      i = _v.includes('italic') ? elements.push(document.createElement('i')) : '';
      e.style.fontStyle = '';
    }
    if (e.style.textDecoration) {
      var _v2 = e.style.textDecoration;
      u = _v2.includes('underline') ? elements.push(document.createElement('u')) : '';
      s = _v2.includes('line-through') ? elements.push(document.createElement('s')) : '';
      e.style.textDecoration = '';
    }
    if (e.nodeName === 'DEL' || e.nodeName === 'STRIKE') {
      if ('' !== s) {
        elements.push(document.createElement('s'));
      }
      replace = true;
    }
    var el = elements.reduce(function (f, n) {
      if (f !== 0) {
        f.appendChild(n);
      }
      return n;
    }, 0);
    if (el !== 0) {
      changed++;
      [].concat(_toConsumableArray(e.childNodes)).forEach(function (c) {
        el.appendChild(c);
      });
      if (replace) {
        e.parentNode.replaceChild(elements[0], e);
      } else {
        e.appendChild(elements[0]);
      }
    }
  });
  return [frag, changed];
}

exports.default = format;