'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * {inline,para,full}
 * @param       {[type]} status [description]
 * @constructor
 */

function computeStyle(selection, el) {
  var inline = void 0,
      para = void 0,
      full = void 0;
  if (selection.type === 0) {
    // let tmp = selection.select.commonAncestorContainer;
    // if (tmp.nodeName !== '#text') {
    //   // inline = inlineStyle(tmp);
    //   // judgeFont(selection.origin);
    // } else {
    //   // inline = inlineStyle(tmp.parentNode);
    // }
    para = paraStyle(selection.parent);
  } else {
    var paras = [];
    paras.push(paraStyle(selection.select.startContainer));
    paras.push(paraStyle(selection.select.endContainer));
    var next = selection.select.startContainer.nextElementSibling;
    while (next && next !== selection.select.endContainer) {
      paras.push(paraStyle(next));
      next = next.nextElementSibling;
    }
    para = paras.reduce(function (f, e, i, arr) {
      f.color.push(e.color);
      f.fontSize.push(e.fontSize);
      f.lineHeight.push(e.lineHeight);
      f.textAlign.push(e.textAlign);
      if (i === arr.length - 1) {
        for (var key in f) {
          f[key] = Array.from(new Set(f[key]));
        }
      }
      return f;
    }, { color: [], fontSize: [], lineHeight: [], textAlign: [] });
  }
  if (selection.range.collapsed) {
    inline = judgeFont(selection.wraped, true);
  } else {
    inline = judgeFont(selection.wraped);
  }
  full = paraStyle(el);
  console.log(inline, para, full);
  return { inline: inline, para: para, full: full };
}

function inlineStyle(el) {
  if (el && el.style) {
    var _window$getComputedSt = window.getComputedStyle(el),
        color = _window$getComputedSt.color,
        fontSize = _window$getComputedSt.fontSize,
        lineHeight = _window$getComputedSt.lineHeight,
        backgroundColor = _window$getComputedSt.backgroundColor,
        fontStyle = _window$getComputedSt.fontStyle,
        fontWeight = _window$getComputedSt.fontWeight,
        textDecoration = _window$getComputedSt.textDecoration;

    return {
      color: color,
      fontSize: fontSize,
      lineHeight: lineHeight,
      backgroundColor: backgroundColor,
      fontStyle: fontStyle,
      fontWeight: fontWeight,
      textDecoration: textDecoration
    };
  }
}

function paraStyle(el) {
  var _window$getComputedSt2 = window.getComputedStyle(el),
      color = _window$getComputedSt2.color,
      fontSize = _window$getComputedSt2.fontSize,
      lineHeight = _window$getComputedSt2.lineHeight,
      textAlign = _window$getComputedSt2.textAlign;

  return { color: color, fontSize: fontSize, lineHeight: lineHeight, textAlign: textAlign //,marginTop,marginLeft,marginRight,marginBottom,paddingTop,paddingLeft,paddingRight,paddingBottom};
  };
}

function judgeFont(el, collapsed) {
  var sizes = [];
  var colors = [];
  var bgColors = [];
  var length = collapsed ? 1 : el.innerText ? el.innerText.length : [].concat(_toConsumableArray(el.childNodes)).reduce(function (f, e) {
    console.log(e);
    f += e.innerText ? e.innerText.length : e.data ? e.data.length : 0;
    return f;
  }, 0);
  var map = {
    'B': 0,
    'I': 0,
    'U': 0,
    'S': 0,
    'SUB': 0,
    'SUP': 0
  };
  if (el.querySelectorAll) {
    [].concat(_toConsumableArray(el.querySelectorAll('*'))).forEach(function (e) {
      sizes.push(e.style.fontSize);
      colors.push(e.style.color);
      bgColors.push(e.style.backgroudColor);
      map[e.nodeName] += collapsed ? 1 : e.innerText.length;
    });
  }
  return {
    b: length === map['B'],
    i: length === map['I'],
    u: length === map['U'],
    s: length === map['S'],
    sb: length === map['SUB'],
    sp: length === map['SUP'],
    sizes: Array.from(new Set(sizes)),
    colors: Array.from(new Set(colors)),
    bgColors: Array.from(new Set(bgColors))
  };
}

// function judgeStyle(type, el) {
//   [...el.querySelectorAll(type)].forEach(e => e.remove());
//   return el.innerText === '';
// }

exports.default = {
  computeStyle: computeStyle
};