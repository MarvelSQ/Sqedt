'use strict';

/**
 * {inline,para,full}
 * @param       {[type]} status [description]
 * @constructor
 */

function computeStyle(selection, el) {
  let inline,
    para,
    full;
  if (selection.type === 0) {
    // let tmp = selection.select.commonAncestorContainer;
    // if (tmp.nodeName !== '#text') {
    //   // inline = inlineStyle(tmp);
    //   // judgeFont(selection.origin);
    // } else {
    //   // inline = inlineStyle(tmp.parentNode);
    // }
    para = paraStyle(selection.parent);
  } else {
    let paras = [];
    paras.push(paraStyle(selection.select.startContainer));
    paras.push(paraStyle(selection.select.endContainer));
    let next = selection.select.startContainer.nextElementSibling;
    while(next&&next!==selection.select.endContainer){
      paras.push(paraStyle(next));
      next = next.nextElementSibling;
    }
  }
  if(selection.range.collapsed){
    inline = judgeFont(selection.wraped,true);
  }else{
    inline = judgeFont(selection.wraped);
  }
  full = paraStyle(el);
  console.log(inline, para, full);
  return {inline, para, full};
}

function paraStyle(el) {
  let {color, fontSize, lineHeight} = window.getComputedStyle(el);
  return {color, fontSize, lineHeight} //,marginTop,marginLeft,marginRight,marginBottom,paddingTop,paddingLeft,paddingRight,paddingBottom};
}

function judgeFont(el,collapsed) {
  let sizes = [];
  let colors = [];
  let bgColors = [];
  let length = collapsed?1:el.innerText?el.innerText.length:[...el.childNodes].reduce((f,e)=>{
    console.log(e);
    f+=e.innerText?e.innerText.length:e.data?e.data.length:0;
    return f;
  },0);
  let map ={
    'B':0,
    'I':0,
    'U':0,
    'S':0,
    'SUB':0,
    'SUP':0,
  };
  if (el.querySelectorAll) {
    [...el.querySelectorAll('*')].forEach(e => {
      sizes.push(e.style.fontSize);
      colors.push(e.style.color);
      bgColors.push(e.style.backgroudColor);
      map[e.nodeName]+=collapsed?1:e.innerText.length;
    });
  }
  return {
    b:length === map['B'],
    i:length === map['I'],
    u:length === map['U'],
    s:length === map['S'],
    sb:length === map['SUB'],
    sp:length === map['SUP'],
    sizes:Array.from(new Set(sizes)),
    colors:Array.from(new Set(colors)),
    bgColors:Array.from(new Set(bgColors)),
  };
}

// function judgeStyle(type, el) {
//   [...el.querySelectorAll(type)].forEach(e => e.remove());
//   return el.innerText === '';
// }

var Status = {
  computeStyle
};

/**
 * event new .para/link a
 */
const DROP = 'drop';
const dragItem = {
  drag: undefined,
  to: undefined,
  area: 0
};
let _template;

let element = undefined;
let bindstate = false;
/**
 * [judgePosition description]
 * @param  {number} x  should be offsetX
 * @param  {number} y  should be offsetY
 * @param  {HTMLDIVElement} el over element
 * @return {number}    drop area
 */
function judgePosition(x, y, el) {
  let w = el.offsetWidth;
  // let rx = x-el.offsetLeft;
  let h = el.offsetHeight;
  // let ry = y-el.offsetTop;
  return ((4 * x) < w)
    ? 1
    : ((4 * x) > (3 * w))
      ? 2
      : ((2 * y) < h)
        ? 3
        : 4;
}

/**
 * [drop description]
 * @param  {node} el   [description]
 * @param  {node} toEl [description]
 * @param  {number} arae [description]
 * @return {[type]}      [description]
 */
function drop(el, toEl, area) {
  let nextEl = (area === 4)
    ? toEl.nextSibling
    : toEl;
  let append = nextEl
    ? el.insertBefore
    : el.appendChild;
  append.call(toEl.parentNode, el, nextEl);
  if (area < 3) {
    el.setAttribute('position', area);
  } else {
    el.removeAttribute('position');
  }
}

function onDragStart(e) {
  dragItem.drag = e.target;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('move','');
  e.dataTransfer.setDragImage(e.target, 0, 0);
}

function onDragEnter(e) {}

function onDragOver(e) {
  e.preventDefault();
  let area = e.target.getAttribute(DROP);
  let newArea = judgePosition(e.offsetX, e.offsetY, e.target);
  if (area && Number(area) === newArea) {
    e.target.setAttribute(DROP, newArea);
  } else {
    e.target.setAttribute(DROP, newArea);
  }
}

function onDragLeave(e) {
  e.target.removeAttribute(DROP);
}

function onDragEnd(e) {
  console.log('drag end');
  if (dragItem.to) {
    drop(dragItem.drag, dragItem.to, dragItem.area);
  }
}

function onDrop(e) {
  dragItem.area = Number(e.target.getAttribute(DROP));
  e.target.removeAttribute(DROP);
  dragItem.to = e.target;
  if (e.dataTransfer.types.some(el => el === 'new')) {
    let value = e.dataTransfer.getData('new');
    let div = document.createElement('div');
    div.classList.add('para');
    div.classList.add(value);
    if (value === 'img') {
      div.setAttribute('contenteditable', false);
      // if(dragItem.area<3){
      //   let t = dragItem.to;
      //   if(t.classList.contains('img')||t.previousElementSibling.classList.contains('img')){
      //
      //   }
      // }
    }
    div.innerHTML = _template[value];
    dragItem.drag = div;
    drop(dragItem.drag, dragItem.to, dragItem.area);
  }
}

function init(el,template) {
  if (bindstate) {
    unbind();
  }
  _template = template;
  element = el;
  el.addEventListener('paste', (e) => {
    // console.log('paste', e, e.clipboardData.types);
    e.preventDefault();
    let range = window.getSelection().getRangeAt(0);
    let text = document.createTextNode(e.clipboardData.getData('text/plain'));
    range.insertNode(text);
    window.getSelection().addRange(range);
  });
  el.addEventListener('dragover', e => {
    if (e.dataTransfer.types.some(e => e === 'link')) {
      e.preventDefault();
    }
  });
  el.addEventListener('drop', (e) => {
    let sl = window.getSelection();
    let range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (e.dataTransfer.types.some(e => e === 'link')) {
      let a = document.createElement('a');
      a.innerText = 'anchor';
      a.href = "https://www.baidu.com/";
      a.target = "_blank";
      range.insertNode(a);
      sl.removeAllRanges();
      sl.addRange(range);
    } else if (e.dataTransfer.types.every(e => e !== 'new'||e!== 'move')) {
      // console.log(e);
      // let oRange = sl.getRangeAt(0);
      range.insertNode(document.createTextNode(e.dataTransfer.getData('text/plain')));
      document.execCommand('forwardDelete');
      // oRange.deleteContents();
      sl.removeAllRanges();
      sl.addRange(range);
      // document.execCommand('insertText', false, e.dataTransfer.getData('text/plain'));
      e.preventDefault(); //prevent default drop
    }
  });
}

function bind() {
  if (!bindstate) {
    element.classList.add('layout');
    element.addEventListener('dragstart', onDragStart);
    element.addEventListener('dragenter', onDragEnter);
    element.addEventListener('dragover', onDragOver);
    element.addEventListener('dragleave', onDragLeave);
    element.addEventListener('dragend', onDragEnd);
    element.addEventListener('drop', onDrop);
    [...element.children].forEach(e=>e.setAttribute('draggable','true'));
    bindstate = true;
  }
}

function unbind() {
  element.classList.remove('layout');
  element.removeEventListener('dragstart', onDragStart);
  // element.removeEventListener('dragenter',onDragEnter);
  element.removeEventListener('dragover', onDragOver);
  element.removeEventListener('dragleave', onDragLeave);
  element.removeEventListener('dragend', onDragEnd);
  element.removeEventListener('drop', onDrop);
  [...element.children].forEach(e=>e.removeAttribute('draggable'));
  bindstate = false;
}

var Drag = {
  init,
  bind,
  unbind,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  bindstate
};

//wrapParent
//getParent
//match{byClass,byTag,byId,byProp}
//replace
//addTag
//removeTag

/**
 * [isAllElements description]
 * @param  {[type]}  type [description]
 * @param  {[type]}  el   [description]
 * @return {Boolean}      [description]
 */
/**
 * [matchById description]
 * @param  {[type]} el [description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
const matchById = (el, id) => {
  if (el.nodeName === '#text') {
    return false;
  }
  return el.id === id;
};

/**
 * [matchByClass description]
 * @param  {[type]} el        [description]
 * @param  {[type]} className [description]
 * @return {[type]}           [description]
 */
const matchByClass = (el, className) => {
  if (el.nodeName === '#text') {
    return false;
  }
  return el.classList.contains(className);
};

/**
 * [matchByTag description]
 * @param  {[type]} el  [description]
 * @param  {[type]} tag [description]
 * @return {[type]}     [description]
 */
const matchByTag = (el, tag) => {
  if (el.nodeName === '#text') {
    return false;
  }
  return el.nodeName.toLowerCase() === tag;
};

/**
 * [judgeStart description]
 * @param  {[type]} reg [description]
 * @return {[type]}     [description]
 */
const judgeStart = reg => {
  let start = reg.charAt(0);
  switch (start) {
    case '#':
      return [matchById, reg.substr(1)];
      break;
    case '.':
      return [matchByClass, reg.substr(1)];
      break;
    default:
      return [matchByTag, reg];
      break;
  }
};

/**
 * wrap content with ele.parentNode til the div.para element.
 * @param  {Node} ele     document's node
 * @param  {Node} content node to be wraped
 * @return {Node}         wrapedSpanElement or undefined
 */
const wrapParent = (reg, ele, content) => {
  let [match,name] = judgeStart(reg);
  let found = undefined;
  let proxy = ele;
  let tmp;
  if (content) {
    tmp = content;
  } else {
    tmp = ele.cloneNode(true);
  }
  while (!found) {
    if (match(proxy, name)) {
      found = proxy.cloneNode(false);
      found.appendChild(tmp);
    } else if (proxy.nodeName === 'BODY') {
      return;
    } else {
      if (proxy.nodeName !== '#text') {
        let tp = proxy.cloneNode(false);
        tp.appendChild(tmp);
        tmp = tp;
      }
      proxy = proxy.parentNode;
    }
  }
  return found;
};

const getParent = (ele, reg) => {
  let [match,
    name] = judgeStart(reg);
  let found = undefined;
  let proxy = ele;
  while (!found) {
    if (match(proxy, name)) {
      found = proxy;
    } else if (proxy.nodeName === 'BODY') {
      return;
    } else {
      proxy = proxy.parentNode;
    }
  }
  return found;
};

function replaceElementIn(reg,node){
  let newFrag = document.createDocumentFragment();
  [...node.querySelectorAll(reg)].forEach(el=>{
    [...el.childNodes].forEach(i=>{
      newFrag.appendChild(i);
    });
    el.parentNode.insertBefore(newFrag,el);
    el.remove();
  });
  node.normalize();
}

function replaceWidthChild(element){
  if(element.parentNode&&element.childNodes){
    let newFrag = document.createDocumentFragment();
    [...element.childNodes].forEach(e=>{
      newFrag.appendChild(e);
    });
    element.parentNode.insertBefore(newFrag);
    element.normalize();
    element.remove();
  }
}

function camlToHypen(str){
  return str.replace(/([A-Z])/g, (word,i)=>{
    return '-'+word.toLowerCase();
  });
}

var util = {
  replaceElementIn,
  replaceWidthChild,
  wrapParent,
  getParent,
  camlToHypen,
};

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
  }else{
    type = 1;

  }
  return {
    range,
    origin: range.cloneContents(),
    wraped: frag,
    type,
    select: select(range,type),
    parent:util.getParent(sl.anchorNode,'.para')
  }
}

function select({startContainer, startOffset, endContainer, endOffset, commonAncestorContainer},type) {
  startContainer = type===0?startContainer:util.getParent(startContainer,'.para');
  endContainer = type===0?endContainer:util.getParent(endContainer,'.para');
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

var handleSl = {
  handleSelection,
  compareSelection
};

const map = {
  'h1': 'Title',
  'h3': 'Title 2',
  'h3u': 'Title 3',
  'p': 'Paragraph',
  'm': 'mark',
  'img': '<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506742225118&di=54b3d9b8cc6cf27ed035d243f4863c9f&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201609%2F30%2F20160930224208_yZJQT.jpeg"/><p>img info</p>',
  'q': '\'quote\'',
  'c': 'Code',
  'a': '<a href="#">auchor</a>'
};

// import util from '../util';
function format(html) {
  let range = document.createRange();
  let frag = range.createContextualFragment(html);
  let changed = 0;
  [...frag.querySelectorAll('*')].forEach(e => {
    let b,
      i,
      u,
      s;
    let replace = false;
    let elements = [];
    if (e.style.fontWeight) {
      let v = e.style.fontWeight;
      b = v.includes('bold') || (v | 0) > 400
        ? elements.push(document.createElement('b'))
        : '';
      e.style.fontWeight = '';
    }
    if (e.style.fontStyle) {
      let v = e.style.fontStyle;
      i = v.includes('italic')
        ? elements.push(document.createElement('i'))
        : '';
      e.style.fontStyle = '';

    }
    if (e.style.textDecoration) {
      let v = e.style.textDecoration;
      u = v.includes('underline')
        ? elements.push(document.createElement('u'))
        : '';
      s = v.includes('line-through')
        ? elements.push(document.createElement('s'))
        : '';
      e.style.textDecoration = '';
    }
    if (e.nodeName === 'DEL' || e.nodeName === 'STRIKE') {
      if ('' !== s) {
        elements.push(document.createElement('s'));
      }
      replace = true;
    }
    let el = elements.reduce((f, n) => {
      if (f !== 0) {
        f.appendChild(n);
      }
      return n;
    }, 0);
    if(el!==0){
      changed++;
      [...e.childNodes].forEach(c=>{
        el.appendChild(c);
      });
      if(replace){
        e.parentNode.replaceChild(elements[0],e);
      }else{
        e.appendChild(elements[0]);
      }
    }
  });
  return [frag,changed];
}

/**
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
const inlinelist = [
  'bold',
  'italic',
  'strikeThrough',
  'underline',
  'subscript',
  'superscript',
  'fontSize',
  'fontColor'
];

const paralist = ['fontSize', 'lineHeight', 'color'];

class Edt {
  constructor(element, option) {
    this.el = element;
    this.selection = undefined;
    this.rangeCopy = undefined;
    this.status = undefined;
    Drag.init(this.el, map);
    this.format = true;
  }

  styleGen() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.edt-page{
      font-size: 12px;
      line-height: 1.2;
      color: #212121;
    }
    .edt-page .para{
      padding: 8px 0;
      font-size: 12px;
      line-height: 1.2;
      color: #212121;
    }`;
    return style;
  }

  init() {
    this.el.classList.add('edt-page');
    document.head.appendChild(this.styleGen());
    document.execCommand('styleWithCss', false, false);
    document.addEventListener('selectionchange', e => {
      // console.log(e);
      if (document.activeElement === this.el) {
        let sl = window.getSelection();
        if (sl.rangeCount) {
          //judge the cursor in the el
          let tmp = handleSl.handleSelection(sl);
          let num = 0;
          if (this.selection) {
            num = handleSl.compareSelection(this.selection, tmp);
          }
          this.selection = tmp;
          this.alertUI(tmp, num);
        }
      }
    });
    this.formatDoc();
    this.editDoc();
    // this.editLayout();
  }

  formatDoc() {
    if (this.format) {
      return;
    }
    let [result,
      changed] = format(this.el.innerHTML);
    if (changed) {
      this.el.innerHTML = '';
      this.el.appendChild(result);
    }
  }

  editDoc() {
    this.status = 1;
    this.el.setAttribute('contenteditable', 'true');
    Drag.unbind();
  }

  editLayout() {
    this.status = 2;
    this.el.setAttribute('contenteditable', 'false');
    Drag.bind();
  }

  alertUI(sl) {
    this.status = Status.computeStyle(sl, this.el);
  }

  /**
   * [command description]
   * @param  {number} level 0:inline,1:para,2:full
   * @param  {number} type  the index of stylelist
   * @return {[type]}       [description]
   */
  command({level, type, value}) {
    if (this.status !== 1) {
      return
    }
    console.log(level);
    if (level === 0) {
      if (type < 6) {
        document.execCommand(inlinelist[type]);
      } else {
        console.log(this.selection.type);
        [...this.selection.origin.querySelectorAll('*')].forEach(e => {
          e.style[inlinelist[type]] = '';
          if (e.nodeName === 'SPAN' && !e.style[0]) {
            util.replaceWidthChild(e);
          }
        });
        if (this.selection.type === 0) {
          let span = document.createElement('span');
          span.style[inlinelist[type]] = value;
          span.appendChild(this.selection.origin);
          this.selection.range.deleteContents();
          this.selection.range.insertNode(span);
        } else {
          [...this.selection.origin.children].forEach(para => {
            para.innerHTML = `<span style="${util.camlToHypen(inlinelist[type])}:${value}"'>${para.innerHTML}</span>`;
          });
          this.selection.range.deleteContents();
          let firstChild = this.selection.origin.firstChild.children[0];
          let lastChild = this.selection.origin.lastChild.children[0];
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
        let next = this.selection.select.startContainer.nextElementSibling;
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

}

module.exports = Edt;
