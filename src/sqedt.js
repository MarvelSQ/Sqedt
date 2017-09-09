'use strict';

var utils = require('./utils');
var InsertNode = require('./InsertNode');

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
