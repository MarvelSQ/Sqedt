'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * [isAllElements description]
 * @param  {[type]}  type [description]
 * @param  {[type]}  el   [description]
 * @return {Boolean}      [description]
 */
var isAllElements = function isAllElements(type, el) {
  if (el.innerText !== '') {
    var elc = el.cloneNode(true);
    var array = elc.querySelectorAll(type);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var cell = _step.value;

        cell.remove();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return elc.innerText === '';
  } else {
    return false;
  }
};

/**
 * [matchById description]
 * @param  {[type]} el [description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
var matchById = function matchById(el, id) {
  if (el.nodeName === '#text') {
    return false;
  }
  return el.id === id;
};

/**
 * [matchByClass description]
 * @param  {[type]} el        [description]
 * @param  {[type]} className [description]
 * @return {[type]}           [description]
 */
var matchByClass = function matchByClass(el, className) {
  if (el.nodeName === '#text') {
    return false;
  }
  return el.classList.contains(className);
};

/**
 * [matchByTag description]
 * @param  {[type]} el  [description]
 * @param  {[type]} tag [description]
 * @return {[type]}     [description]
 */
var matchByTag = function matchByTag(el, tag) {
  if (el.nodeName === '#text') {
    return false;
  }
  return el.nodeName.toLowerCase() === tag;
};

/**
 * [judgeStart description]
 * @param  {[type]} reg [description]
 * @return {[type]}     [description]
 */
var judgeStart = function judgeStart(reg) {
  var start = reg.charAt(0);
  var match = undefined;
  switch (start) {
    case '#':
      return [matchById, reg.substr(1)];
      break;
    case '.':
      return [matchByClass, reg.substr(1)];
      break;
    default:
      return [matchByTag, reg];
      break;
  }
};

/**
 * [removeEmpty description]
 * @param  {HtmlCollection,NodeList,Array} collection this val must be live or inside some root constructure
 * @return {[type]}            [description]
 */
var removeEmpty = function removeEmpty(collection) {
  //childNodes{documentFragment.childNodes,document.querySelectorAll(),}
  //htmlCollection{documentFragment.children,document.getElementByTagName(),...}
  var removeList = [];
  for (var index = 0; index < collection.length; index++) {
    var el = collection[index];
    if (el.innerText === '') {
      removeList.push(el);
    }
  }
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = removeList.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2),
          _index = _step2$value[0],
          element = _step2$value[1];

      element.remove();
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
};

/**
 * [description]
 * @param  {[type]} tag        [description]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
var addTag = function addTag(tag, collection) {
  //childNodes{documentFragment.childNodes,document.querySelectorAll(),}
  //htmlCollection{documentFragment.children,document.getElementByTagName(),...}
  //supposed to be a span collection
  var removeList = [];
  for (var index = 0; index < collection.length; index++) {
    var el = collection[index];
    if (el.innerText == '') {
      removeList.push(el);
    } else {
      el.innerHTML = '<' + tag + '>' + el.innerHTML.replace('<' + tag + '>', '').replace('</' + tag + '>', '') + '</' + tag + '>';
    }
  }
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = removeList.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _step3$value = _slicedToArray(_step3.value, 2),
          _index2 = _step3$value[0],
          element = _step3$value[1];

      element.remove();
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
};

/**
 * [description]
 * @param  {[type]} tag        [description]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
var removeTag = function removeTag(tag, collection) {
  //childNodes{documentFragment.childNodes,document.querySelectorAll(),}
  //htmlCollection{documentFragment.children,document.getElementByTagName(),...}
  var removeList = [];
  for (var index = 0; index < collection.length; index++) {
    var el = collection[index];
    if (el.innerText === '') {
      removeList.push(el);
    } else {
      console.log(el.innerHTML);
      el.innerHTML = el.innerHTML.replace('<' + tag + '>', '').replace('</' + tag + '>', '');
    }
  }
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = removeList.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _step4$value = _slicedToArray(_step4.value, 2),
          _index3 = _step4$value[0],
          element = _step4$value[1];

      element.remove();
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
};

/**
 * [description]
 * @param  {[type]} tag        [description]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
var addTagInPara = function addTagInPara(tag, collection) {
  // let removeList = [];
  for (var index = 0; index < collection.length; index++) {
    var el = collection[index];
    // if (el.innerText === '') {
    //   if (index != 0 || index != collection.length) {
    //     removeList.push(el)
    //   }
    // } else {
    addTag(tag, el.children);
    // }
  }
  // for (let [index,element] of removeList.entries()) {
  //   element.remove();
  // }
};

/**
 * [description]
 * @param  {[type]} tag        [description]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
var removeTagInPara = function removeTagInPara(tag, collection) {
  // let removeList = [];
  for (var index = 0; index < collection.length; index++) {
    var el = collection[index];
    // if (el.innerText === '') {
    //   if (index != 0 || index != collection.length) {
    //     removeList.push(el)
    //   }
    // } else {
    removeTag(tag, el.children);
    // }
  }
  // for (let [index,element] of removeList.entries()) {
  //   element.remove();
  // }
};

var isSame = function isSame(obj, foo) {
  var result = false;
  var oarr = void 0,
      farr = void 0;
  oarr = Object.keys(obj).sort();
  farr = Object.keys(foo).sort();
  if (oarr.toString() == farr.toString()) {
    result = true;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = oarr[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var key = _step5.value;

        if (_typeof(obj[key]) == 'object') {
          result = isSame(obj[key], foo[key]) && result;
        } else {
          result = obj[key] == foo[key] && result;
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    return result;
  } else {
    return false;
  }
};

module.exports = {
  isAllElements: isAllElements,
  matchById: matchById,
  matchByTag: matchByTag,
  matchByClass: matchByClass,
  judgeStart: judgeStart,
  removeEmpty: removeEmpty,
  addTag: addTag,
  removeTag: removeTag,
  addTagInPara: addTagInPara,
  removeTagInPara: removeTagInPara,
  isSame: isSame
};