'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 1.init element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 2.generate para
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * prevent default
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * document.execCommand
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * delete key
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * tab key
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * clipboard
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * modules:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * selectionchange,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * changeNode:{insertNewNode,changeTag,changeFont,changeJustify...}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * drag & drop,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _status = require('./Status/status');

var _status2 = _interopRequireDefault(_status);

var _drag = require('./Drag/drag');

var _drag2 = _interopRequireDefault(_drag);

var _HandleSelection = require('./HandleSelection/HandleSelection');

var _HandleSelection2 = _interopRequireDefault(_HandleSelection);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _template = require('./Template/template');

var _template2 = _interopRequireDefault(_template);

var _format = require('./Format/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var inlinelist = ['bold', 'italic', 'strikeThrough', 'underline', 'subscript', 'superscript', 'fontSize', 'fontColor'];

var paralist = ['fontSize', 'lineHeight', 'color', 'textAlign'];

var DEFULT_CALLBACK = function DEFULT_CALLBACK() {
  for (var _len = arguments.length, all = Array(_len), _key = 0; _key < _len; _key++) {
    all[_key] = arguments[_key];
  }

  console.log(all);
};

var Edt = function () {
  function Edt(element) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { format: false, callback: DEFULT_CALLBACK },
        format = _ref.format,
        callback = _ref.callback;

    _classCallCheck(this, Edt);

    this.el = element;
    this.selection = undefined;
    this.rangeCopy = undefined;
    this.status = undefined;
    _drag2.default.init(this.el, _template2.default.map, this.dragBack());
    this.format = format;
    this.callbacks = [];
    this.addCallback(callback);
  }

  _createClass(Edt, [{
    key: 'getDragin',
    value: function getDragin() {
      return _drag2.default.generateDragin(this);
    }
  }, {
    key: 'styleGen',
    value: function styleGen() {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = '.edt-page{\n      font-size: 12px;\n      line-height: 1.2;\n      color: #212121;\n    }\n    .edt-page .para{\n      padding: 8px 0;\n      font-size: 12px;\n      line-height: 1.2;\n      color: #212121;\n    }';
      return style;
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      this.el.classList.add('edt-page');
      document.head.appendChild(this.styleGen());
      document.execCommand('styleWithCss', false, false);
      document.addEventListener('selectionchange', function (e) {
        // console.log(e);
        if (document.activeElement === _this.el) {
          var sl = window.getSelection();
          if (sl.rangeCount) {
            //judge the cursor in the el
            var tmp = _HandleSelection2.default.handleSelection(sl);
            // let num = 0;
            // if (this.selection) {
            //   num = handleSl.compareSelection(this.selection, tmp);
            // }
            _this.selection = tmp;
            _this.alertUI({ type: 0, value: _status2.default.computeStyle(tmp, _this.el) });
          }
        }
      });
      this.formatDoc();
      this.editDoc();
      // this.editLayout();
    }
  }, {
    key: 'formatDoc',
    value: function formatDoc() {
      console.log(this.format);
      if (this.format) {
        return;
      }

      var _Format = (0, _format2.default)(this.el.innerHTML),
          _Format2 = _slicedToArray(_Format, 2),
          result = _Format2[0],
          changed = _Format2[1];

      if (changed) {
        this.el.innerHTML = '';
        this.el.appendChild(result);
      }
    }
  }, {
    key: 'editDoc',
    value: function editDoc() {
      this.status = 1;
      this.el.setAttribute('contenteditable', 'true');
      _drag2.default.unbind();
    }
  }, {
    key: 'editLayout',
    value: function editLayout() {
      this.status = 2;
      this.el.setAttribute('contenteditable', 'false');
      _drag2.default.bind();
    }
  }, {
    key: 'alertUI',
    value: function alertUI(_ref2) {
      var type = _ref2.type,
          value = _ref2.value;

      this.callbacks.forEach(function (e) {
        e({ type: type, value: value });
      });
    }
  }, {
    key: 'dragBack',
    value: function dragBack() {
      var _this2 = this;

      return function (ele) {
        _this2.alertUI({ type: 2, value: ele });
      };
    }
  }, {
    key: 'addTemplate',
    value: function addTemplate(_ref3) {
      var value = _ref3.value,
          innerHTML = _ref3.innerHTML,
          outer = _ref3.outer,
          callback = _ref3.callback;

      _template2.default.addTemplate({ value: value, innerHTML: innerHTML, outer: outer, callback: callback });
    }
  }, {
    key: 'addCallback',
    value: function addCallback(fn) {
      if (!this.callbacks.includes(fn)) {
        this.callbacks.push(fn);
      }
    }

    /**
     * [command description]
     * @param  {number} level 0:inline,1:para,2:full
     * @param  {number} type  the index of stylelist
     * @return {[type]}       [description]
     */

  }, {
    key: 'command',
    value: function command(_ref4) {
      var level = _ref4.level,
          type = _ref4.type,
          value = _ref4.value;

      if (this.status !== 1) {
        return;
      }
      console.log(level);
      if (level === 0) {
        if (type < 6) {
          document.execCommand(inlinelist[type]);
        } else {
          console.log(this.selection.type);
          [].concat(_toConsumableArray(this.selection.origin.querySelectorAll('*'))).forEach(function (e) {
            e.style[inlinelist[type]] = '';
            if (e.nodeName === 'SPAN' && !e.style[0]) {
              _util2.default.replaceWidthChild(e);
            }
          });
          if (this.selection.type === 0) {
            var span = document.createElement('span');
            span.style[inlinelist[type]] = value;
            span.appendChild(this.selection.origin);
            this.selection.range.deleteContents();
            this.selection.range.insertNode(span);
          } else {
            [].concat(_toConsumableArray(this.selection.origin.children)).forEach(function (para) {
              para.innerHTML = '<span style="' + _util2.default.camlToHypen(inlinelist[type]) + ':' + value + '"\'>' + para.innerHTML + '</span>';
            });
            this.selection.range.deleteContents();
            var firstChild = this.selection.origin.firstChild.children[0];
            var lastChild = this.selection.origin.lastChild.children[0];
            this.selection.origin.firstChild.remove();
            this.selection.origin.lastChild.remove();
            this.selection.range.insertNode(this.selection.origin);
            this.selection.select.startContainer.appendChild(firstChild);
            this.selection.select.endContainer.insertBefore(lastChild, this.selection.select.endContainer.firstChild);
            this.selection.range.setStart(firstChild, 0);
            this.selection.range.setEnd(lastChild, lastChild.childNodes.length);
          }
          window.getSelection().addRange(this.selection.range);
        }
      } else if (level === 1) {
        if (this.selection.type === 0) {
          this.selection.parent.style[paralist[type]] = value;
        } else {
          this.selection.select.startContainer.style[paralist[type]] = value;
          this.selection.select.endContainer.style[paralist[type]] = value;
          var next = this.selection.select.startContainer.nextElementSibling;
          while (next && next !== this.selection.select.endContainer) {
            next.style[paralist[type]] = value;
            next = next.nextElementSibling;
          }
        }
      } else {
        this.el.style[paralist[type]] = value;
      }
    }

    // createNewPara(type){
    //   let newPara = document.createElement('div');
    //   newPara.classList.add('para');
    //   return newPara;
    // }

  }]);

  return Edt;
}();

exports.default = Edt;