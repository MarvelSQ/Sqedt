import Edt from '../ES/index';

let editor = document.getElementById('editor');
let btns = document.getElementById('btns');
let drags = document.getElementById('drags');

let edt = new Edt(editor);

edt.init();
edt.addTemplate({value:'ul',innerHTML:'<ul><li>item 1</li></ul>'});

let {dragstart,dragend} = edt.getDragin();

drags.addEventListener('dragstart',dragstart);
drags.addEventListener('dragend',dragend);

edt.addCallback(({type,value})=>{
  if(type == 2){
    if(value.classList.contains('img')){
      let img = value.getElementsByTagName('img')[0];
      var newurl = prompt("input img url", img.src); //将输入的内容赋给变量 name ，
      //这里需要注意的是，prompt有两个参数，前面是提示的话，后面是当对话框出来后，在对话框里的默认值
      if (newurl)//如果返回的有内容
      {
         img.src = newurl;
      }
    }else if(value.nodeName === 'A'){
      var newurl = prompt("input anchor url", value.href); //将输入的内容赋给变量 name ，
      //这里需要注意的是，prompt有两个参数，前面是提示的话，后面是当对话框出来后，在对话框里的默认值
      if (newurl)//如果返回的有内容
      {
         value.href = newurl;
      }
    }
  }
})
