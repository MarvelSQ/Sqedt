const utils = require('./utils')
const State = require('./SelectState')

function SelectEvent(selection) {}

const handleSelection = selection => {
  let range = selection.getRangeAt(0);
  let fragment = range.cloneContents();

  let results = fragment.querySelectorAll('.para');
  // let span = getParent(range.startContainer, 'span');
  let span_copy = {};
  if (results.length === 0) {
    span_copy = wrapParentPara(range.commonAncestorContainer, fragment);
    results = [span_copy]
  }

  let state = new State();

  function colorRGB2Hex(color) {
    if (!color || color === '') {
      return undefined
    }
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);

    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
  }
  if (selection.isCollapsed) {
    state.b = results[0].innerHTML.indexOf('<b>') >= 0;
    state.u = results[0].innerHTML.indexOf('<u>') >= 0;
    state.i = results[0].innerHTML.indexOf('<i>') >= 0;
    state.d = results[0].innerHTML.indexOf('<del>') >= 0;
    let i = Number(cell.style.fontSize.replace('px', ''));
    state.size.add(i === 0
      ? 16
      : i);
    let c = colorRGB2Hex(cell.style.color)
    state.color.add(c === undefined
      ? '#212121'
      : c);
  } else {
    for (let cell of results) {
      state.b = state.b&&utils.isAllElements('b', cell);
      state.u = state.u&&utils.isAllElements('u', cell);
      state.i = state.i&&utils.isAllElements('i', cell);
      state.d = state.d&&utils.isAllElements('del', cell);
      let i = Number(cell.style.fontSize.replace('px', ''));
      state.size.add(i === 0
        ? 16
        : i);
      let c = colorRGB2Hex(cell.style.color)
      state.color.add(c === undefined
        ? '#212121'
        : c);
    }
  }

  return state;
}
