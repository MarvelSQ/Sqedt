'use strict';

var utils = require('./utils');

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

  return edt;
};

module.exports = SQEdt;