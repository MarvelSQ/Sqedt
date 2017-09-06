'use strict';

require('babel-polyfill');
/**
 * this state is editor's select_state
 * @constructor
 */
function State() {
  this.b = true;
  this.u = true;
  this.d = true;
  this.i = true;
  this.size = new Set();
  this.justify = new Set();
  this.color = new Set();
}

module.exports = State;