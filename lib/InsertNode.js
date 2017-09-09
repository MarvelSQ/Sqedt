'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var utils = require('./utils');

function insertNode(state) {
  this.el.focus();
  var range = this.sl.getRangeAt(0);
  var parent = void 0;
  var preParent = void 0,
      endParent = void 0;
  var mid = undefined;
  var type = 0; //0:inside span one element,
  //1:inside span muti elements,
  //2:muti span,
  //3:muti div.para,
  //4:muti div.para that has empty elements,
  //5:muti div.para all of them are empty,
  //6:muti div.para before and
  var start = void 0,
      end = void 0;

  //prehandle
  if (range.collapsed) {
    var text = document.createTextNode('B');
    mid = utils.wrapParent('span', range.startContainer, text);
    parent = utils.getParent(range.startContainer, 'span');
  } else {
    mid = range.cloneContents();
    if (mid.querySelectorAll('.para').length > 0) {
      var num = mid.childNodes.length;
      type = 3;
      if (mid.childNodes[0].childNodes.length == 0) {
        type++;
      }
      if (mid.childNodes[num - 1].childNodes.length == 0) {
        type++;
      }
      if (num >= 3) {
        type = 6;
      }
      preParent = utils.getParent(range.startContainer, '.para');
      endParent = utils.getParent(range.endContainer, '.para');
    } else if (mid.querySelectorAll('span').length > 0) {
      type = 2;
      preParent = utils.getParent(range.startContainer, 'span');
      endParent = utils.getParent(range.endContainer, 'span');
    } else {
      type = 1;
      mid = utils.wrapParent('span', range.startContainer, mid);
      parent = utils.getParent(range.startContainer, 'span');
    }
  }

  //inner handle
  if (state.allB) {
    if (type == 0 || type == 1) {
      mid.innerHTML = '<b>' + mid.innerHTML.replace('<b>', '').replace('</b>', '') + '</b>';
    } else if (type == 2) {
      utils.addTag('b', mid.childNodes);
    } else if (type == 3) {
      utils.addTagInPara('b', mid.childNodes);
    }
  } else {
    if (type == 0 || type == 1) {
      mid.innerHTML = mid.innerHTML.replace('<b>', '').replace('</b>', '');
    } else if (type == 2) {
      utils.removeTag('b', mid.childNodes);
    } else if (type == 3) {
      utils.removeTagInPara('b', mid.childNodes);
    }
  }

  //selection handle
  range.deleteContents();
  if (type < 2) {
    range.setStartBefore(parent);
  } else {
    range.setStartBefore(preParent);
  }
  var fore = range.cloneContents();
  utils.removeEmpty(fore.children);
  range.deleteContents();
  if (type < 2) {
    range.setEndAfter(parent);
  } else {
    range.setEndAfter(endParent);
  }
  var after = range.cloneContents();
  utils.removeEmpty(after.children);

  range.deleteContents();
  console.log(after.children);
  if (type > 2) {
    preParent = fore.childNodes[0];
    endParent = after.childNodes[0];
  }
  range.insertNode(after);
  start = type < 2 ? mid.childNodes[0] : mid.childNodes[0].childNodes[0];
  var endEl = mid.childNodes[mid.childNodes.length - 1];
  end = type < 2 ? endEl : endEl.childNodes[endEl.childNodes.length - 1];

  if (type <= 2) {
    range.insertNode(mid);
  } else {
    var _mid$childNodes = _toArray(mid.childNodes),
        pf = _mid$childNodes[0],
        pm = _mid$childNodes.slice(1);

    var pl = pm.pop();
    for (var index = 0; index < pf.childNodes.length; index++) {
      preParent.appendChild(pf.childNodes[index]);
    }
    for (var _index = pl.childNodes.length - 1; _index >= 0; _index--) {
      endParent.insertBefore(pl.childNodes[_index], endParent.firstChild);
    }
    mid.childNodes[0].remove();
    mid.childNodes[mid.childNodes.length - 1].remove();
    range.insertNode(mid);
  }
  range.insertNode(fore);
  console.log(mid);

  range.setStartBefore(start);
  range.setEndAfter(end);
  // }
  console.log(range.cloneContents());
  console.log(start);
  this.sl.selectAllChildren(start);
  var offset = end.childNodes.length ? end.childNodes.length : end.length;
  this.sl.extend(end, offset);
}

function replace(reg, node) {
  var newFrag = document.createDocumentFragment();
  [].concat(_toConsumableArray(node.querySelectorAll(reg))).forEach(function (el) {
    [].concat(_toConsumableArray(el.childNodes)).forEach(function (i) {
      newFrag.appendChild(i);
    });
    el.parentNode.insertBefore(newFrag, el);
    el.remove();
  });
  node.normalize();
}

module.exports = insertNode;