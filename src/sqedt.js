'use strict';
require('babel-polyfill')

var utils = require('./utils');
var state = require('./SelectState')
var selectEvent = require('./selectEvent')

var DEFAULT_CONFIG = {};

function Edt(config) {
  this.el = config.el;
  this.sl = window.getSelection();
  this.callbackInChange = (s) => {
    console.log('default callbackInChange');
  };
}

const createInstance = config => new Edt(config);

const SQEdt=(el,option)=>{
  if (!el) {
    throw new Error('element must be prepared!')
  }

  let edt = createInstance(Object.assign({
    el: el
  }, option, DEFAULT_CONFIG));

  //when a para is empty, cell will be replace with this
  el.addEventListener('keyup', e => {
    let sl = window.getSelection();
    if (e.keyCode === 8) {
      if (sl.isCollapsed) {
        let para = utils.getParent(sl.anchorNode, '.para');
        if (para && para.innerHTML === '<br>' && e.keyCode === 8) {
          para.innerHTML = '<span style="font-size:16px;"><br></span>';
          sl.getRangeAt(0).selectNode(para.firstElementChild)
        }
      }
    }
  })

  //add selectionchange to inform UI
  document.addEventListener('selectionchange', e => {
    if (document.activeElement === el) { //judge the cursor in the el
      let state = selectEvent(window.getSelection());
      let same = utils.isEqual(edt.slState, state);
      if (!same) {
        edt.slState = state;
        edt.callbackInChange(state, e); //call the callback to subscriber
      }
    }
  })

  //cause of the function not fully prepared
  el.addEventListener('copy', e => {
    e.returnValue = false;
    return false;
  })

  el.addEventListener('paste', e => {
    e.returnValue = false;
    return false;
  })

  el.addEventListener('cut', e => {
    e.returnValue = false;
    return false;
  })

  return edt;
}

module.exports = SQEdt;
