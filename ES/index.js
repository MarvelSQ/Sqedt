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
import Status from './Status/status';
import Drag from './Drag/drag';
import handleSl from './HandleSelection/HandleSelection';
import util from './util';
import Template from './Template/template';
import Format from './Format/format';

const inlinelist = [
  'bold',
  'italic',
  'strikeThrough',
  'underline',
  'subscript',
  'superscript',
  'fontSize',
  'fontColor'
]

const paralist = ['fontSize', 'lineHeight', 'color', 'textAlign']

const DEFULT_CALLBACK = (...all)=>{
  console.log(all);
}

class Edt {

  constructor(element, {format,callback} = {format :false,callback :DEFULT_CALLBACK}) {
    this.el = element;
    this.selection = undefined;
    this.rangeCopy = undefined;
    this.status = undefined;
    Drag.init(this.el, Template.map,this.dragBack());
    this.format = format;
    this.callbacks = [];
    this.addCallback(callback);
  }

  getDragin(){
    return Drag.generateDragin(this);
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
    }`
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
          // let num = 0;
          // if (this.selection) {
          //   num = handleSl.compareSelection(this.selection, tmp);
          // }
          this.selection = tmp;
          this.alertUI({type:0,value:Status.computeStyle(tmp, this.el)});
        }
      }
    });
    this.formatDoc();
    this.editDoc();
    // this.editLayout();
  }

  formatDoc() {
    console.log(this.format);
    if (this.format) {
      return;
    }
    let [result,
      changed] = Format(this.el.innerHTML);
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

  alertUI({type,value}) {
    this.callbacks.forEach(e => {
      e({type,value});
    })
  }

  dragBack(){
    return (ele)=>{
      this.alertUI({type:2,value:ele});
    }
  }

  addTemplate({value,innerHTML,outer,callback}){
    Template.addTemplate({value,innerHTML,outer,callback});
  }

  addCallback(fn){
    if(!this.callbacks.includes(fn)){
      this.callbacks.push(fn);
    }
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
        })
        if (this.selection.type === 0) {
          let span = document.createElement('span');
          span.style[inlinelist[type]] = value;
          span.appendChild(this.selection.origin);
          this.selection.range.deleteContents();
          this.selection.range.insertNode(span);
        } else {
          [...this.selection.origin.children].forEach(para => {
            para.innerHTML = `<span style="${util.camlToHypen(inlinelist[type])}:${value}"'>${para.innerHTML}</span>`
          })
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

export default Edt;
