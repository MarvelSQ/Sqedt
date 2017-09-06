'use strict';

var utils = require('./utils');

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

module.exports = SQEdt;
