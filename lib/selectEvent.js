'use strict';

var utils = require('./utils');
var State = require('./SelectState');

var handleSelection = function handleSelection(selection) {
  var state = new State();
  var range = selection.getRangeAt(0);
  state.textNum = range.toString().replace('\n', '').length;
  var fragment = range.cloneContents();

  var results = fragment.querySelectorAll('.para');
  var spanCopy = {};
  if (results.length === 0) {
    spanCopy = utils.wrapParent('.para', range.commonAncestorContainer, fragment);
    results = [spanCopy];
  }

  function colorRGB2Hex(color) {
    if (!color || color === '') {
      return undefined;
    }
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1], 10);
    var g = parseInt(rgb[1], 10);
    var b = parseInt(rgb[2].split(')')[0], 10);

    var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
  }

  if (selection.isCollapsed) {
    state.b = results[0].innerHTML.indexOf('<b>') >= 0;
    state.u = results[0].innerHTML.indexOf('<u>') >= 0;
    state.i = results[0].innerHTML.indexOf('<i>') >= 0;
    state.d = results[0].innerHTML.indexOf('<del>') >= 0;
    utils.getChildrenStyle('fontSize', results[0]).forEach(function (n) {
      var i = Number(n.replace('px', ''));
      state.size.add(i === 0 ? 16 : i);
    });
    utils.getChildrenStyle('color', results[0]).forEach(function (n) {
      var c = colorRGB2Hex(n);
      state.color.add(c === undefined ? '#212121' : c);
    });
    var align = results[0].style.textAlign;
    state.justify.add(align === '' ? 'left' : align);
  } else {
    results.forEach(function (cell) {
      state.b = state.b && utils.isAllElements('b', cell);
      state.u = state.u && utils.isAllElements('u', cell);
      state.i = state.i && utils.isAllElements('i', cell);
      state.d = state.d && utils.isAllElements('del', cell);
      utils.getChildrenStyle('fontSize', cell).forEach(function (n) {
        var i = Number(n.replace('px', ''));
        state.size.add(i === 0 ? 16 : i);
      });
      utils.getChildrenStyle('color', cell).forEach(function (n) {
        var c = colorRGB2Hex(n);
        state.color.add(c === undefined ? '#212121' : c);
      });
      var align = cell.style.textAlign;
      state.justify.add(align === '' ? 'left' : align);
    });
  }

  return state;
};

function SelectEvent(selection) {
  return handleSelection(selection).export();
}

module.exports = SelectEvent;