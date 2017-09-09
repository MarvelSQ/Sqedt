'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

require('babel-polyfill');

var utils = require('./utils');
var InsertNode = require('./InsertNode');
var SelectState = require('./SelectState');
var selectEvent = require('./selectEvent');

var DEFAULT_CONFIG = {
  minLines: 1
};

function Edt(config) {
  this.el = config.el;
  this.sl = window.getSelection();
  this.callbackInChange = function (s) {
    console.log('default callbackInChange', s);
  };
  this.slState = new SelectState().export();
}

Edt.prototype.addCallback = function (cb) {
  this.callbackInChange = cb;
};

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
        var para = utils.getParent(sl.anchorNode, '.para');
        if (para && para.innerHTML === '<br>') {
          para.innerHTML = '<span style="font-size:16px;color:#212121"><br></span>';
          sl.getRangeAt(0).selectNode(para.firstElementChild);
        }
      }
      if (el.innerHTML === '') {
        el.innerHTML = '<div class="para" style="text-align:left"><span style="font-size:16px;color:#212121"><br></span></div>';
      }
    }
  });

  //add selectionchange to inform UI
  document.addEventListener('selectionchange', function (e) {
    if (document.activeElement === el) {
      //judge the cursor in the el
      selectionChange();
    }
  });

  function selectionChange() {
    var state = selectEvent(window.getSelection());
    var same = utils.isEqual(edt.slState, state);
    console.log(same);
    console.log(state.toString());
    console.log(edt.slState.toString());
    if (!same) {
      edt.slState = state;
      edt.callbackInChange(state); //call the callback to subscriber
    }
  }

  //cause of the function not fully prepared
  // el.addEventListener('copy', e => {
  //   e.returnValue = false;
  //   return false;
  // })

  el.addEventListener('paste', function (e) {
    e.returnValue = false;
    return false;
  });

  // el.addEventListener('cut', e => {
  //   e.returnValue = false;
  //   return false;
  // })

  el.addEventListener('keydown', function (e) {
    console.log(e);
    //cmd+i||cmd+b
    if (e.keyCode == 73 && e.metaKey) {
      e.returnValue = false;
    } else if (e.keyCode === 8) {
      var sl = window.getSelection();
      if (sl.isCollapsed && sl.anchorOffset == 0) {
        var start = sl.anchorNode;
        console.log(start);
        if (utils.isFirstInPara(start)) {
          var para = utils.getParent(start, '.para');
          if (para.style.textAlign != 'left') {
            para.style.textAlign = 'left';
            selectionChange();
          } else if (para.innerText != '') {
            var previous = para.previousElementSibling;
            if (previous && previous.classList.contains('para')) {
              if (previous.innerHTML == '<span style="font-size:16px;color:#212121"><br></span>') {
                previous.remove();
              } else {
                var frag = document.createDocumentFragment();
                [].concat(_toConsumableArray(para.childNodes)).forEach(function (es) {
                  frag.appendChild(es);
                  console.log(frag);
                });
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
  });

  el.contentEditable = true;

  el.style.textAlign = 'left';

  return edt;
};

/**
 * [change description]
 * @param  {[type]} option config info about the document
 *                         {bold,italic,underline,deleteline,size{number,Increase,Decrease},Justify{left,center,right,aligned},color{#hex}}
 * @return {[type]}        [description]
 */
Edt.prototype.change = function (option) {
  this.cutSelectionTo3();
  //TAG add or reduce
  if (option.bold || option.italic || option.underline || option.deleteline) {}
  //TAG inner props change
  if (option.size || option.color) {}
  //paragraph handle
  if (option.justify) {}
};

Edt.prototype.insertNode = InsertNode;

module.exports = SQEdt;