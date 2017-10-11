/**
 * event new .para/link a
 */
const DROP = 'drop';
const dragItem = {
  drag: undefined,
  to: undefined,
  area: 0
}
let _template;
let callback = function(ele){
  console.log('DEFAULT Callback');
}

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
    el.removeAttribute('position')
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
    let temp = _template[value];
    let div = document.createElement(temp.outer?temp.outer:'div');
    div.classList.add('para');
    div.classList.add(value);
    div.innerHTML = temp.innerHTML;
    if(temp.rule){
      temp.rule.forEach(e=>{
        if(e.attr){
          div.setAttribute(e.attr, e.value);
        }
      })
    }
    if(temp.callback){
      callback(div);
    }
    dragItem.drag = div;
    drop(dragItem.drag, dragItem.to, dragItem.area);
  }
}

function init(el,template,cb) {
  if (bindstate) {
    if(element){
      unbind();
    }
    bindstate = false;
  }
  _template = template
  element = el;
  callback = cb;
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
  })
  el.addEventListener('drop', (e) => {
    let sl = window.getSelection();
    let range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (e.dataTransfer.types.some(e => e === 'link')) {
      let a = document.createElement('a');
      a.innerText = 'anchor';
      a.href = "https://www.baidu.com/"
      a.target = "_blank"
      range.insertNode(a);
      sl.removeAllRanges();
      sl.addRange(range);
      callback(a);
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
  if(bindstate){
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
}

function bindCallback(fn){
  callback = fn;
}

function generateDragin(edt){
  return {dragstart:(e) => {
      if(e.target.dataset.edtDrag){
        e.dataTransfer.setDragImage(e.target,0,0);
        let value = e.target.dataset.edtDrag;
        if(value!=='a'){
          edt.editLayout();
          e.dataTransfer.setData('new',value);
        } else {
          e.dataTransfer.dropEffect='copyMove';
          e.dataTransfer.setData('link',value);
        }
      }
    },dragend:(e)=>{
      edt.editDoc();
    }}
}

export default {
  init,
  bind,
  unbind,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  bindstate,
  bindCallback,
  generateDragin,
}
