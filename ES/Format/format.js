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
    }, 0)
    if(el!==0){
      changed++;
      [...e.childNodes].forEach(c=>{
        el.appendChild(c);
      })
      if(replace){
        e.parentNode.replaceChild(elements[0],e);
      }else{
        e.appendChild(elements[0]);
      }
    }
  })
  return [frag,changed];
}

export default format;
