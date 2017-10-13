import util from '../util';
/**
 * [handleSelection description]
 * @param  {selection} sl window.getSelection()
 * @return {[type]}    [description]
 */

const blocks = ['div' , 'p' , 'form', 'ul', 'li', 'ol', 'dl', 'form', 'address', 'fieldset', 'hr', 'menu', 'table'];

function handleSelection(sl) {
  let type;
  let range = sl.getRangeAt(0);
  let frag = range.cloneContents();
  let paras = frag.querySelectorAll('.para');
  let n = sl.anchorNode;
  let o = sl.anchorOffset;
  let tmpparent = util.getParent(sl.anchorNode, '.para');
  let parent = tmpparent?tmpparent:replaceWidthBlocks(util.getDirectSon(sl.anchorNode,'.edt-page'));
  if(sl.anchorNode!=n){
    console.log('selection change by change parent');
    sl.collapse(n,o);
  }
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
    parent
  }
}

function replaceWidthBlocks(sonNode){
  if(blocks.includes(sonNode.nodeName.toLowerCase())){
    sonNode.classList.add('para');
    return sonNode;
  }
  console.log('parent changed');
  let div = document.createElement('div');
  div.classList.add('para');
  // let childs = document.createDocumentFragment();
  let childs = [sonNode];
  if(sonNode.previousSibling&&!blocks.includes(sonNode.previousSibling.nodeName.toLowerCase())){
    childs.unshift(sonNode.previousSibling);
  }
  if(sonNode.nextSibling&&!blocks.includes(sonNode.nextSibling.nodeName.toLowerCase())){
    childs.push(sonNode.nextSibling);
  }
  sonNode.parentNode.insertBefore(div,sonNode);
  childs.forEach(e=>{
    div.appendChild(e);
  })
  return div;
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
