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
const isAllElements = (type, el) => {
  if (el.innerText !== '') {
    let elc = el.cloneNode(true);
    [...elc.querySelectorAll(type)].forEach(e=>e.remove());
    return elc.innerText === ''
  } else {
    return false;
  }
}

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
}

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
}

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
}

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
}

/**
 * [removeEmpty description]
 * @param  {HtmlCollection,NodeList,Array} collection this val must be live or inside some root constructure
 * @return {[type]}            [description]
 */
const removeEmpty = function(collection) {
  //childNodes{documentFragment.childNodes,document.querySelectorAll(),}
  //htmlCollection{documentFragment.children,document.getElementByTagName(),...}
  let removeList = [];
  for (let index = 0; index < collection.length; index++) {
    let el = collection[index]
    if (el.innerText === '') {
      removeList.push(el)
    }
  }
  for (let [index,
    element]of removeList.entries()) {
    element.remove();
  }
}

/**
 * [description]
 * @param  {[type]} tag        [description]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
const addTag = function(tag, collection) {
  //childNodes{documentFragment.childNodes,document.querySelectorAll(),}
  //htmlCollection{documentFragment.children,document.getElementByTagName(),...}
  //supposed to be a span collection
  let removeList = [];
  for (let index = 0; index < collection.length; index++) {
    let el = collection[index]
    if (el.innerText == '') {
      removeList.push(el);
    } else {
      el.innerHTML = `<${tag}>${el.innerHTML.replace(`<${tag}>`, '').replace(`</${tag}>`, '')}</${tag}>`
    }
  }
  for (let [index,
    element]of removeList.entries()) {
    element.remove();
  }
}

/**
 * [description]
 * @param  {[type]} tag        [description]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
const removeTag = function(tag, collection) {
  //childNodes{documentFragment.childNodes,document.querySelectorAll(),}
  //htmlCollection{documentFragment.children,document.getElementByTagName(),...}
  let removeList = [];
  for (let index = 0; index < collection.length; index++) {
    let el = collection[index]
    if (el.innerText === '') {
      removeList.push(el);
    } else {
      el.innerHTML = el.innerHTML.replace(`<${tag}>`, '').replace(`</${tag}>`, '')
    }
  }
  for (let [index,
    element]of removeList.entries()) {
    element.remove();
  }
}

/**
 * [description]
 * @param  {[type]} tag        [description]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
const addTagInPara = function(tag, collection) {
  // let removeList = [];
  for (let index = 0; index < collection.length; index++) {
    let el = collection[index]
    // if (el.innerText === '') {
    //   if (index != 0 || index != collection.length) {
    //     removeList.push(el)
    //   }
    // } else {
    addTag(tag, el.children);
    // }

  }
  // for (let [index,element] of removeList.entries()) {
  //   element.remove();
  // }
}

/**
 * [description]
 * @param  {[type]} tag        [description]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
const removeTagInPara = function(tag, collection) {
  // let removeList = [];
  for (let index = 0; index < collection.length; index++) {
    let el = collection[index]
    // if (el.innerText === '') {
    //   if (index != 0 || index != collection.length) {
    //     removeList.push(el)
    //   }
    // } else {
    removeTag(tag, el.children);
    // }

  }
  // for (let [index,element] of removeList.entries()) {
  //   element.remove();
  // }
}

/**
 * compare obj & foo is equal
 * @param  {Object} obj [description]
 * @param  {Object} foo [description]
 * @return {Boolean}     [description]
 */
const isEqual = function(obj, foo) {
  let result = false;
  let oarr = Object.keys(obj).sort(),
    farr = Object.keys(foo).sort();
  if (oarr.toString() === farr.toString()) {
    result = true;
    oarr.forEach(key => {
      if (typeof obj[key] === 'object') {
        result = isEqual(obj[key], foo[key]) && result;
      } else {
        result = (obj[key] === foo[key]) && result;
      }
    })
  }
  return result;
}

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
}

const getChildrenStyle = (type, el) => {
  let spans = el.childNodes;
  let arr = [];
  if (spans && spans.length > 0) {
    [...spans].forEach(c => {
      arr.push(c.style[type])
    })
  }
  return arr;
}

const getParent = (ele, reg) => {
  let [match,
    name] = judgeStart(reg)
  let found = undefined;
  let proxy = ele;
  while (!found) {
    if (match(proxy, name)) {
      found = proxy;
    } else if (proxy.nodeName === 'BODY') {
      return;
    } else {
      proxy = proxy.parentNode
    }
  }
  return found;
}

function isFirstInPara(el) {
  if(el.classList){
    if(el.classList.contains('para')){
      return true
    }
  }
  if (!isFirst(el)) {
    return false;
  } else {
    if (el.parentNode.classList.contains('para')) {
      return true;
    } else {
      return isFirstInPara(el.parentNode)
    }
  }
}

function isLastInPara(el){
  if(el.classList){
    if(el.classList.contains('para')){
      return true
    }
  }
  if(!isLast(el)){
    return false;
  }else{
    if(el.parentNode.classList.contains('para')){
      return true;
    }else{
      return isLastInPara(el.parentNode)
    }
  }
}

function isFirst(el) {
  return el.parentNode.firstChild === el
}

function isLast(el){
  return el.parentNode.lastChild === el
}

function replaceElementIn(reg,node){
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

function replaceWidthChild(element){
  if(element.parentNode&&element.childNodes){
    let newFrag = document.createDocumentFragment();
    [...element.childNodes].forEach(e=>{
      newFrag.appendChild(e);
    })
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

export default {
  replaceElementIn,
  replaceWidthChild,
  wrapParent,
  getParent,
  camlToHypen,
}
