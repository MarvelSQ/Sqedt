import util from '../util';
/**
 * [handleSelection description]
 * @param  {selection} sl window.getSelection()
 * @return {[type]}    [description]
 */
function handleSelection(sl) {
  let type;
  let range = sl.getRangeAt(0);
  let frag = range.cloneContents();
  let paras = frag.querySelectorAll('.para');
  if (paras.length === 0) {
    frag = util.wrapParent('.para', sl.extentNode, frag);
    type = 0;
  } else {
    type = 1;

  }
  return {
    range,
    origin: range.cloneContents(),
    wraped: frag,
    type,
    select: select(range, type),
    parent: util.getParent(sl.anchorNode, '.para')
  }
}

function select({
  startContainer,
  startOffset,
  endContainer,
  endOffset,
  commonAncestorContainer
}, type) {
  startContainer = type === 0
    ? startContainer
    : util.getParent(startContainer, '.para');
  endContainer = type === 0
    ? endContainer
    : util.getParent(endContainer, '.para');
  return {startContainer, startOffset, endContainer, endOffset, commonAncestorContainer};
}

function compareSelection(oldVal, val) {
  // console.log(oldVal.range.endContainer);
  // console.log(val.range.endContainer);
  // if (oldVal) {
  //   if (oldVal.select.startContainer === val.select.startContainer && oldVal.select.endContainer === val.select.endContainer) {
  //     return 0; //no tag change
  //   }
  // }
  return 1; //changed
}

export default {
  handleSelection,
  compareSelection
};
