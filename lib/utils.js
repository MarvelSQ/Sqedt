/**
 * [isAllElements description]
 * @param  {[type]}  type [description]
 * @param  {[type]}  el   [description]
 * @return {Boolean}      [description]
 */
const isAllElements = (type, el) => {
  if (el.innerText !== '') {
    let elc = el.cloneNode(true)
    let array = elc.querySelectorAll(type)
    for (let cell of array) {
      cell.remove();
    }
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
  let match = undefined;
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
      console.log(el.innerHTML);
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

const isSame = function(obj, foo) {
  let result = false;
  let oarr,
    farr;
  oarr = Object.keys(obj).sort();
  farr = Object.keys(foo).sort();
  if (oarr.toString() == farr.toString()) {
    result = true;
    for (let key of oarr) {
      if (typeof obj[key] == 'object') {
        result = isSame(obj[key], foo[key]) && result;
      } else {
        result = (obj[key] == foo[key]) && result;
      }
    }
    return result;
  } else {
    return false;
  }
}

export.exports = {
  isAllElements:isAllElements,
  matchById:matchById,
  matchByTag:matchByTag,
  matchByClass:matchByClass,
  judgeStart:judgeStart,
  removeEmpty:removeEmpty,
  addTag:addTag,
  removeTag:removeTag,
  addTagInPara:addTagInPara,
  removeTagInPara:removeTagInPara,
  isSame:isSame
}
