'use strict';

require('babel-polyfill')

var utils = require('./utils');
var InsertNode = require('./InsertNode');
var SelectState = require('./SelectState')
var selectEvent = require('./selectEvent')

var DEFAULT_CONFIG = {
  minLines: 1
};

function Edt(config) {
  this.el = config.el;
  this.sl = window.getSelection();
  this.callbackInChange = (s) => {
    console.log('default callbackInChange', s);
  };
  this.slState = new SelectState().export();
}

Edt.prototype.addCallback = function(cb) {
  this.callbackInChange = cb;
}

const createInstance = config => new Edt(config);

const SQEdt = (el, option) => {
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
        if (para && para.innerHTML === '<br>') {
          para.innerHTML = '<span style="font-size:16px;color:#212121"><br></span>';
          sl.getRangeAt(0).selectNode(para.firstElementChild)
        }
      }
      if (el.innerHTML === '') {
        el.innerHTML = '<div class="para" style="text-align:left"><span style="font-size:16px;color:#212121"><br></span></div>'
      }

    }
  })

  //add selectionchange to inform UI
  document.addEventListener('selectionchange', e => {
    if (document.activeElement === el) { //judge the cursor in the el
      let state = selectEvent(window.getSelection());
      let same = utils.isEqual(edt.slState, state);
      console.log(same);
      console.log(state.toString());
      console.log(edt.slState.toString());
      if (!same) {
        edt.slState = state;
        edt.callbackInChange(state, e); //call the callback to subscriber
      }
    }
  })

  //cause of the function not fully prepared
  // el.addEventListener('copy', e => {
  //   e.returnValue = false;
  //   return false;
  // })

  el.addEventListener('paste', e => {
    e.returnValue = false;
    return false;
  })

  // el.addEventListener('cut', e => {
  //   e.returnValue = false;
  //   return false;
  // })

  el.addEventListener('keydown', e => {
    console.log(e);
    //cmd+i||cmd+b
    if (e.keyCode == 73 && e.metaKey) {
      e.returnValue = false;
    } else if (e.keyCode === 8) {
      let sl = window.getSelection();
      if (sl.isCollapsed && sl.anchorOffset == 0) {
        let start = sl.anchorNode;
        if (utils.isFirstInPara(sl.anchorNode)) {
          let para = utils.getParent(sl.anchorNode, '.para')
          if (para.style.textAlign != 'left') {
            para.style.textAlign = 'left';
          } else if (para.innerText != '') {
            let previous = para.previousElementSibling
            if (previous && previous.classList.contains('para')) {
              if (previous.innerHTML == '<span style="font-size:16px;color:#212121"><br></span>') {
                previous.remove();
              } else {
                let frag = document.createDocumentFragment();
                [...para.childNodes].forEach(es => {
                  frag.appendChild(es);
                  console.log(frag);
                })
                previous.appendChild(frag);
                sl.collapse(start, 0);
                para.remove();
              }
            }
          } else {
            para.remove();
          }
        }
        e.returnValue = false;
      }
    }
  })

  el.contentEditable = true;

  el.style.textAlign = 'left';

  return edt;
}

/**
 * [change description]
 * @param  {[type]} option config info about the document
 *                         {bold,italic,underline,deleteline,size{number,Increase,Decrease},Justify{left,center,right,aligned},color{#hex}}
 * @return {[type]}        [description]
 */
Edt.prototype.change = function(option) {
  this.cutSelectionTo3()
  //TAG add or reduce
  if (option.bold || option.italic || option.underline || option.deleteline) {}
  //TAG inner props change
  if (option.size || option.color) {}
  //paragraph handle
  if (option.justify) {}
}

Edt.prototype.insertNode = InsertNode;

module.exports = SQEdt;
