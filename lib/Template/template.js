'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var map = {
  'h1': { innerHTML: 'Title' },
  'h3': { innerHTML: 'Title 2' },
  'h3u': { innerHTML: 'Title 3' },
  'p': { innerHTML: 'Paragraph' },
  'm': { innerHTML: 'mark' },
  'img': { innerHTML: '<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506742225118&di=54b3d9b8cc6cf27ed035d243f4863c9f&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201609%2F30%2F20160930224208_yZJQT.jpeg"/><p>img info</p>', rule: [{ attr: 'contenteditable', value: false }], callback: true },
  'q': { innerHTML: '\'quote\'' },
  'c': { innerHTML: 'Code' },
  'a': { innerHTML: '<a href="#">auchor</a>', callback: true }

  /**
   * [addTemplate description]
   * @param {string} value     can be transfer by dataTransfer
   * @param {string} innerHTML html the showed content
   * @param {string} outer     the block element's name
   * @param {Boolean} callback can this opreation callback
   * @param {object} rule      rule of editable...
   */
};function addTemplate(_ref) {
  var value = _ref.value,
      innerHTML = _ref.innerHTML,
      outer = _ref.outer,
      rule = _ref.rule,
      callback = _ref.callback;

  if (map[value]) {
    map[value] = { innerHTML: innerHTML, outer: outer, rule: rule, callback: callback };
  } else {
    map[value] = { innerHTML: innerHTML, outer: outer, rule: rule, callback: callback };
  }
}

exports.default = { map: map, addTemplate: addTemplate };