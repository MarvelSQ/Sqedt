const utils = require('./utils')
const State = require('./SelectState')

const handleSelection = selection => {
  let state = new State();
  let range = selection.getRangeAt(0);
  state.textNum = range.toString().length;
  let fragment = range.cloneContents();

  let results = fragment.querySelectorAll('.para');
  let spanCopy = {};
  if (results.length === 0) {
    spanCopy = utils.wrapParent('.para', range.commonAncestorContainer, fragment);
    results = [spanCopy]
  }

  function colorRGB2Hex(color) {
    if (!color || color === '') {
      return undefined
    }
    let rgb = color.split(',');
    let r = parseInt(rgb[0].split('(')[1],10);
    let g = parseInt(rgb[1],10);
    let b = parseInt(rgb[2].split(')')[0],10);

    let hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    return hex;
  }

  if (selection.isCollapsed) {
    state.b = results[0].innerHTML.indexOf('<b>') >= 0;
    state.u = results[0].innerHTML.indexOf('<u>') >= 0;
    state.i = results[0].innerHTML.indexOf('<i>') >= 0;
    state.d = results[0].innerHTML.indexOf('<del>') >= 0;
    utils.getChildrenStyle('fontSize', results[0]).forEach(n => {
      let i = Number(n.replace('px', ''));
      state.size.add(i === 0
        ? 16
        : i);
    })
    utils.getChildrenStyle('color', results[0]).forEach(n => {
      let c = colorRGB2Hex(n)
      state.color.add(c === undefined
        ? '#212121'
        : c);
    })
    let align = results[0].style.textAlign;
    state.justify.add(align === ''
      ? 'left'
      : align);
  } else {
    results.forEach(cell => {
      state.b = state.b && utils.isAllElements('b', cell);
      state.u = state.u && utils.isAllElements('u', cell);
      state.i = state.i && utils.isAllElements('i', cell);
      state.d = state.d && utils.isAllElements('del', cell);
      utils.getChildrenStyle('fontSize', cell).forEach(n => {
        let i = Number(n.replace('px', ''));
        state.size.add(i === 0
          ? 16
          : i);
      })
      utils.getChildrenStyle('color', cell).forEach(n => {
        let c = colorRGB2Hex(n)
        state.color.add(c === undefined
          ? '#212121'
          : c);
      })
      let align = cell.style.textAlign;
      state.justify.add(align === ''
        ? 'left'
        : align);
    })
  }

  return state;
}

function SelectEvent(selection) {
  return handleSelection(selection).export();
}

module.exports = SelectEvent
