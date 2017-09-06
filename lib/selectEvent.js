'use strict';

var utils = require('./utils');
var State = require('./SelectState');

function SelectEvent(selection) {}

var handleSelection = function handleSelection(selection) {
  var range = selection.getRangeAt(0);
  var fragment = range.cloneContents();

  var results = fragment.querySelectorAll('.para');
  // let span = getParent(range.startContainer, 'span');
  var span_copy = {};
  if (results.length === 0) {
    span_copy = wrapParentPara(range.commonAncestorContainer, fragment);
    results = [span_copy];
  }

  var state = new State();

  function colorRGB2Hex(color) {
    if (!color || color === '') {
      return undefined;
    }
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);

    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
  }
  if (selection.isCollapsed) {
    state.b = results[0].innerHTML.indexOf('<b>') >= 0;
    state.u = results[0].innerHTML.indexOf('<u>') >= 0;
    state.i = results[0].innerHTML.indexOf('<i>') >= 0;
    state.d = results[0].innerHTML.indexOf('<del>') >= 0;
    var i = Number(cell.style.fontSize.replace('px', ''));
    state.size.add(i === 0 ? 16 : i);
    var c = colorRGB2Hex(cell.style.color);
    state.color.add(c === undefined ? '#212121' : c);
  } else {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _cell = _step.value;

        state.b = state.b && utils.isAllElements('b', _cell);
        state.u = state.u && utils.isAllElements('u', _cell);
        state.i = state.i && utils.isAllElements('i', _cell);
        state.d = state.d && utils.isAllElements('del', _cell);
        var _i = Number(_cell.style.fontSize.replace('px', ''));
        state.size.add(_i === 0 ? 16 : _i);
        var _c = colorRGB2Hex(_cell.style.color);
        state.color.add(_c === undefined ? '#212121' : _c);
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
  }

  return state;
};