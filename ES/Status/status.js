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
    let paras = []
    paras.push(paraStyle(selection.select.startContainer));
    paras.push(paraStyle(selection.select.endContainer));
    let next = selection.select.startContainer.nextElementSibling;
    while(next&&next!==selection.select.endContainer){
      paras.push(paraStyle(next));
      next = next.nextElementSibling;
    }
    para = paras.reduce((f,e,i,arr)=>{
      f.color.push(e.color);
      f.fontSize.push(e.fontSize);
      f.lineHeight.push(e.lineHeight);
      f.textAlign.push(e.textAlign);
      if(i === arr.length-1){
        for(let key in f){
          f[key] = Array.from(new Set(f[key]));
        }
      }
      return f;
    },{color:[],fontSize:[],lineHeight:[],textAlign:[]});
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

function inlineStyle(el) {
  if (el && el.style) {
    let {
      color,
      fontSize,
      lineHeight,
      backgroundColor,
      fontStyle,
      fontWeight,
      textDecoration
    } = window.getComputedStyle(el);
    return {
      color,
      fontSize,
      lineHeight,
      backgroundColor,
      fontStyle,
      fontWeight,
      textDecoration
    };
  }
}

function paraStyle(el) {
  let {color, fontSize, lineHeight, textAlign} = window.getComputedStyle(el);
  return {color, fontSize, lineHeight, textAlign} //,marginTop,marginLeft,marginRight,marginBottom,paddingTop,paddingLeft,paddingRight,paddingBottom};
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
  }
  if (el.querySelectorAll) {
    [...el.querySelectorAll('*')].forEach(e => {
      sizes.push(e.style.fontSize);
      colors.push(e.style.color);
      bgColors.push(e.style.backgroudColor);
      map[e.nodeName]+=collapsed?1:e.innerText.length;
    })
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

export default {
  computeStyle
}
