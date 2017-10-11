const vars = {
  btn: [
    ['bold'],
    ['styleWithCSS', false, true],
    ['formatBlock'],
    ['insertHorizontalRule'],
    ['insertOrderedList'],
    ['insertUnorderedList'],
    ['insertParagraph'],
    ['indent'],
    ['outdent'],
    ['enableObjectResizing']
  ],
  input: [
    {pars:['backColor', false,], df:'#87ceeb'},
    {pars:['createLink', false,], df:'https://www.baidu.com'},
    {pars:['insertImage', false,], df:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506742225118&di=54b3d9b8cc6cf27ed035d243f4863c9f&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201609%2F30%2F20160930224208_yZJQT.jpeg'}
  ],
  single: [
    {label:'justify',pars: [], values: ['justifyCenter','justifyLeft','justifyRight','justifyFull']},
    {label:'fontSize',pars:['fontSize', false,], values:[1,2,3,4,5,6,7]},
  ]
};
let btns = document.getElementById('command');
btns.innerHTML = vars.btn.reduce((f, n, i) => f + `<button data-op='${i}'>${n[0]}</button>`, '');
btns.addEventListener('click', function(e) {
  console.log(e.target);
  btnOp(e.target.dataset.op);
  edt.focus();
})
let inputs = document.getElementById('inputs');
inputs.innerHTML = vars.input.reduce((f,n,i) => f + `<label>${n.pars[0]}:</label><input onchange="inputOp(this,${i})" value="${n.df}">`,'');

let selects = document.getElementById('selects');
selects.innerHTML = vars.single.reduce((f,n,i) => f + `<label>${n.label}</label><select onchange="slOp(this,${i})" data-sg="${i}">${getOptions(n)}</select>`,'');

function getOptions(single){
  return single.values.reduce((f,n,i)=>f+`<option value="${typeof n === 'object'?n.value:n}">${typeof n === 'object'?n.label:n}</option>`,'');
}

function slOp(sl,index){
  console.log(...vars.single[index].pars,sl.value);
  if(sl.value.trim()!=''){
    document.execCommand(...vars.single[index].pars,sl.value);
  }
}

function btnOp(type) {
  document.execCommand(...vars.btn[type]);
}

function inputOp(input,index) {
  console.log('input',input.value,index);
  if(input.value.trim()!=''){
  input.blur();
  edt.focus();
  let sl = window.getSelection();
  let range = sl.getRangeAt(0);
  let inRange = opRange;
  // range.setStart(inRange.startContainer,inRange.startOffset);
  sl.collapse(inRange.startContainer,inRange.startOffset);
  sl.extend(inRange.endContainer,inRange.endOffset);
  // console.log(inRange);
  // range.setEnd(inRange.endContainer,inRange.endOffset);
  // console.log(inRange);
  document.execCommand(...[...vars.input[index].pars,input.value]);
}
}

let code = document.getElementById('code');
let lines = document.getElementById('lines');
let edt = document.getElementsByClassName('editor')[0];

function resizeImg(e) {
  console.log(e);
  e.preventDefault();
  return false;
}

let opImg = [];

let popupwindow = document.createElement('div');
popupwindow.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(88,88,88,0.3);';
// popupwindow.innerHTML = '<div style="margin:40px auto;width:600px;"></div>';

function addImg(el) {
  opEl = el;
  let html = `
    <div style="margin:40px auto;width:600px">
      <div style="margin:10px;box-shadow:0 2px 8px 1px #888;padding:8px;background-color:#fff;border-radius:4px;">
        <div style="margin-bottom:10px"><img src="${el.src}" style="width:100%"></div>
        <div>
          <select>
            <option ${el.style.width
    ? 'selected'
    : ''}>width</option>
            <option ${el.style.height
      ? 'selected'
      : ''}>height</ption>
          </select>
          <input value="${el.style.width
        ? el.style.width.replace('px', '')
        : el.style.height.replace('px', '')}" placeholder="default is 100%">
        </div>
        <div>
          <button onclick="saveWindow()">save</buttopn>
          <button onclick="closeWindow()">close</buttopn>
        </div>
      </div>
    </div>`;
  popupwindow.innerHTML = html;
  popupwindow.getElementsByTagName('input')[0].addEventListener('keyup', enterClick);
}

let opEl = undefined;

function enterClick(e) {
  console.log(e);
  if (e.keyCode == 13) {
    saveWindow();
  }
}

function showPopup() {
  if (popupwindow.parentNode) {
    popupwindow.style.display = "block";
  } else {
    document.body.appendChild(popupwindow);
  }
}

function saveWindow() {
  let type = popupwindow.getElementsByTagName('select')[0].value;
  let num = popupwindow.getElementsByTagName('input')[0].value;
  opEl.style.width = '';
  opEl.style.height = '';
  opEl.style[type] = (num | 0) == 0
    ? '100%'
    : ((num | 0) + 'px');
  closeWindow();
}

function closeWindow() {
  popupwindow.style.display = 'none';
}

edt.addEventListener('dblclick', e => {
  console.log(e);
  if (e.srcElement.tagName == 'IMG') {
    let offset = [...e.srcElement.parentNode.childNodes].indexOf(e.srcElement);
    window.getSelection().collapse(e.srcElement.parentNode,offset);
    window.getSelection().extend(e.srcElement.parentNode,offset+1);
    activeImgControl(e.srcElement);
    // addImg(e.srcElement);
    // showPopup();
  } else if (e.srcElement.tagName == 'DIV') {} else {
    console.log(e.srcElement.tagName);
  }
})

let imgs = document.getElementById('imgs');

function activeImgControl(img){
  opEl = img;
  html = `<label>width:</label><input onchange="imgChange(this,0)" value="${img.style.width.trim()}">
  <label>height:</label><input onchange="imgChange(this,1)" value="${img.style.height.trim()}">`
  imgs.innerHTML = html;
}

function deactiveImg(){
  imgs.innerHTML = '';
}

function imgChange(input,type){
  let map = ['width','height'];
  opEl.style[map[type]] = input.value;
}
// edt.addEventListener('mouseover',e=>{
//   if(e.toElement.tagName === 'IMG'){
//     console.log(e.fromElement,e.toElement,e.relatedTarget)
//     e.toElement.addEventListener('drag',resizeImg);
//     if(!opImg.includes(e.toElement)){
//       opImg.push(e.toElement);
//     }
//   } else {
//     opImg.forEach(e=>{
//       console.log('remove',e);
//       e.removeEventListener('drag',resizeImg)
//     });
//     opImg = [];
//   }
// });

edt.addEventListener('input', (e) => {
  let [html,
    linenum] = formatCode(edt.innerHTML);
  code.innerHTML = html;
  // lines.innerHTML = numbers(linenum);
})
let opRange;
document.addEventListener('selectionchange', e => {
  if (document.activeElement === edt) {
    let range = window.getSelection().getRangeAt(0);
    let s = range.commonAncestorContainer;
    let frag = range.cloneContents();
    let {startContainer,startOffset,endContainer,endOffset} = range;
    opRange = {startContainer,startOffset,endContainer,endOffset};
    console.log(e)
  }
})
function numbers(num) {
  return num > 0
    ? numbers(num - 1) + num + '\n'
    : '';
}
const BLOCK = [
  'DIV',
  'P',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HR',
  'OL',
  'UL',
  'PRE',
  'TABLE'
];
function formatEditor() {

  let result = [...edt.childNodes].reduce((f, n, i) => {
    if (!BLOCK.includes(n.nodeName)) {
      if (Array.isArray(f[f.length - 1])) {
        f[f.length - 1].push(n);
      } else {
        f.push([n]);
      }
      return f;
    } else {
      f.push(n);
      return f;
    }
  }, []);
  result = result.reduce((f, n, i) => {
    return f.concat(formatPara(n));
  }, []);
  console.log(result);
}
function formatPara(cell) {
  let result;
  if (Array.isArray(cell)) {
    result = [cell];
  } else {
    result = [...cell.childNodes].reduce((f, n, i) => {
      if (BLOCK.includes(n.nodeName)) {
        f.push(n);
      } else {
        if (f.length == 0) {
          f.push([n]);
        } else if (!Array.isArray(f[f.length - 1])) {
          f.push([n]);
        } else {
          f[f.length - 1].push(n);
        }
      }
      return f;
    }, []);
  }
  return result;
}
// this.HTML_DECODE = {
//       "&lt;"  : "<",
//       "&gt;"  : ">",
//       "&amp;" : "&",
//       "&nbsp;": " ",
//       "&quot;": "\"",
//       "&copy;": "©"
//
//       // Add more
//  };
function formatCode(str) {
  let indent = 0;
  let num = 0;
  return [
    '\n' + str.split(/>/).map((e, i, arr) => {
      if (e.includes('</') || e.includes('<br') || e.includes('<img')) {
        indent = indent > 0
          ? indent - 1
          : 0;
        num++;
        e = e.replace(/<\//, '\n' + space(indent) + '</');
      } else if (e.indexOf('<') > 0) {
        num++;
        e = e.replace(/</g, '\n' + space(indent) + '<');
        indent++;
      } else {
        indent++;
      }
      num++;
      return ((i < arr.length - 1)
        ? e + '>\n' + space(indent)
        : e);
    }).reduce((f, n) => f + n, '').replace(/&nbsp;&nbsp;\n/g, '').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    num
  ];
}
function space(num) {
  return num > 0
    ? space(num - 1) + '&nbsp;&nbsp;'
    : '';
}
