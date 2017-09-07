'use strict';

require('babel-polyfill');

var utils = require('./utils');
var state = require('./SelectState');
var selectEvent = require('./selectEvent');

var DEFAULT_CONFIG = {};

function Edt(config) {
  this.el = config.el;
  this.sl = window.getSelection();
  this.callbackInChange = function (s) {
    console.log('default callbackInChange');
  };
}

var createInstance = function createInstance(config) {
  return new Edt(config);
};

var SQEdt = function SQEdt(el, option) {
  if (!el) {
    throw new Error('element must be prepared!');
  }

  var edt = createInstance(Object.assign({
    el: el
  }, option, DEFAULT_CONFIG));

  //when a para is empty, cell will be replace with this
  el.addEventListener('keyup', function (e) {
    var sl = window.getSelection();
    if (e.keyCode === 8) {
      if (sl.isCollapsed) {
        var para = getParent(sl.anchorNode, '.para');
        if (para && para.innerHTML == '<br>' && e.keyCode === 8) {
          para.innerHTML = '<span style="font-size:16px;"><br></span>';
          sl.getRangeAt(0).selectNode(para.firstElementChild);
        }
      }
    }
  });

  //add selectionchange to inform UI
  document.addEventListener('selectionchange', function (e) {
    if (document.activeElement == el) {
      //judge the cursor in the el
      var _state = handleSelection(edt.sl).export();
      var same = utils.isEqual(edt.slState, _state);
      if (!same) {
        edt.slState = _state;
        edt.callbackInChange(_state, e); //call the callback to subscriber
      }
    }
  });

  //cause of the function not fully prepared
  el.addEventListener('copy', function (e) {
    e.returnValue = false;
    return false;
  });

  el.addEventListener('paste', function (e) {
    e.returnValue = false;
    return false;
  });

  el.addEventListener('cut', function (e) {
    e.returnValue = false;
    return false;
  });

  return edt;
};

module.exports = SQEdt;