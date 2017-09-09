var utils = require('./utils')

function insertNode(state){
  this.el.focus();
  let range = this.sl.getRangeAt(0);
  let parent;
  let preParent,
    endParent;
  let mid = undefined;
  let type = 0; //0:inside span one element,
  //1:inside span muti elements,
  //2:muti span,
  //3:muti div.para,
  //4:muti div.para that has empty elements,
  //5:muti div.para all of them are empty,
  //6:muti div.para before and
  let start,
    end;

  //prehandle
  if (range.collapsed) {
    let text = document.createTextNode('B')
    mid = utils.wrapParent('span',range.startContainer, text)
    parent = utils.getParent(range.startContainer, 'span')
    // b.style.fontSize = '16px'
    // b.innerHTML = '<b>B</b>'
    // console.log(range.surroundContents());
  } else {
    mid = range.cloneContents();
    if (mid.querySelectorAll('.para').length > 0) {
      let num = mid.childNodes.length;
      type = 3;
      if (mid.childNodes[0].childNodes.length == 0) {
        type++;
      }
      if (mid.childNodes[num - 1].childNodes.length == 0) {
        type++;
      }
      if (num >= 3) {
        type = 6;
      }
      preParent = utils.getParent(range.startContainer, '.para')
      endParent = utils.getParent(range.endContainer, '.para')
    } else if (mid.querySelectorAll('span').length > 0) {
      type = 2;
      preParent = utils.getParent(range.startContainer, 'span')
      endParent = utils.getParent(range.endContainer, 'span')
    } else {
      type = 1;
      mid = utils.wrapParent('span',range.startContainer, mid)
      parent = utils.getParent(range.startContainer, 'span')
    }
  }

  //inner handle
  if (state.allB) {
    if (type == 0 || type == 1) {
      mid.innerHTML = `<b>${mid.innerHTML.replace('<b>', '').replace('</b>', '')}</b>`
    } else if (type == 2) {
      utils.addTag('b', mid.childNodes)
    } else if (type == 3) {
      utils.addTagInPara('b', mid.childNodes)
    }
  } else {
    if (type == 0 || type == 1) {
      mid.innerHTML = mid.innerHTML.replace('<b>', '').replace('</b>', '')
    } else if (type == 2) {
      utils.removeTag('b', mid.childNodes)
    } else if (type == 3) {
      utils.removeTagInPara('b', mid.childNodes)
    }
  }

  //selection handle
  range.deleteContents();
  if (type < 2) {
    range.setStartBefore(parent);
  } else {
    range.setStartBefore(preParent)
  }
  let fore = range.cloneContents();
  utils.removeEmpty(fore.children)
  range.deleteContents();
  if (type < 2) {
    range.setEndAfter(parent);
  } else {
    range.setEndAfter(endParent)
  }
  let after = range.cloneContents();
  utils.removeEmpty(after.children)

  range.deleteContents();
  console.log(after.children);
  if (type > 2) {
    preParent = fore.childNodes[0]
    endParent = after.childNodes[0]
  }
  range.insertNode(after);
  start = type < 2
    ? mid.childNodes[0]
    : mid.childNodes[0].childNodes[0];
  let endEl = mid.childNodes[mid.childNodes.length - 1]
  end = type < 2
    ? endEl
    : endEl.childNodes[endEl.childNodes.length - 1];

  if (type <= 2) {
    range.insertNode(mid);
  } else {
    let [pf,
      ...pm] = mid.childNodes;
    let pl = pm.pop();
    for (let index = 0; index < pf.childNodes.length; index++) {
      preParent.appendChild(pf.childNodes[index])
    }
    for (let index = pl.childNodes.length - 1; index >= 0; index--) {
      endParent.insertBefore(pl.childNodes[index], endParent.firstChild)
    }
    mid.childNodes[0].remove();
    mid.childNodes[mid.childNodes.length - 1].remove();
    range.insertNode(mid);
  }
  range.insertNode(fore);
  console.log(mid);

  range.setStartBefore(start);
  range.setEndAfter(end);
  // }
  console.log(range.cloneContents());
  console.log(start);
  this.sl.selectAllChildren(start)
  let offset = end.childNodes.length
    ? end.childNodes.length
    : end.length
  this.sl.extend(end, offset)
}


function replace(reg,node){
  let newFrag = document.createDocumentFragment();
  [...node.querySelectorAll(reg)].forEach(el=>{
    [...el.childNodes].forEach(i=>{
      newFrag.appendChild(i);
    })
    el.parentNode.insertBefore(newFrag,el);
    el.remove();
  })
  node.normalize();
}

module.exports = insertNode;
