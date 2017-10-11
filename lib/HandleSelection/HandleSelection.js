'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [handleSelection description]
 * @param  {selection} sl window.getSelection()
 * @return {[type]}    [description]
 */
function handleSelection(sl) {
  var type = void 0;
  var range = sl.getRangeAt(0);
  var frag = range.cloneContents();
  var paras = frag.querySelectorAll('.para');
  if (paras.length === 0) {
    frag = _util2.default.wrapParent('.para', sl.extentNode, frag);
    type = 0;
  } else {
    type = 1;
  }
  return {
    range: range,
    origin: range.cloneContents(),
    wraped: frag,
    type: type,
    select: select(range, type),
    parent: _util2.default.getParent(sl.anchorNode, '.para')
  };
}

function select(_ref, type) {
  var startContainer = _ref.startContainer,
      startOffset = _ref.startOffset,
      endContainer = _ref.endContainer,
      endOffset = _ref.endOffset,
      commonAncestorContainer = _ref.commonAncestorContainer;

  startContainer = type === 0 ? startContainer : _util2.default.getParent(startContainer, '.para');
  endContainer = type === 0 ? endContainer : _util2.default.getParent(endContainer, '.para');
  return { startContainer: startContainer, startOffset: startOffset, endContainer: endContainer, endOffset: endOffset, commonAncestorContainer: commonAncestorContainer };
}

function compareSelection(oldVal, val) {
  // console.log(oldVal.range.endContainer);
  // console.log(val.range.endContainer);
  // if (oldVal) {
  //   if (oldVal.select.startContainer === val.select.startContainer && oldVal.select.endContainer === val.select.endContainer) {
  //     return 0; //no tag change
  //   }
  // }
  return 1; //changed
}

exports.default = {
  handleSelection: handleSelection,
  compareSelection: compareSelection
};