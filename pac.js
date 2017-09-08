var edt = require('./index')

var medt = document.getElementById('edt');

medt.innerHTML='<div class="para" style="text-align:left"><span style="font-size:16px;color:#212121"><b>Hello World!</b></span></div>'+
               '<div class="para" style="text-align:center"><span style="font-size:16px;color:#212121">Hello World!</span></div>'+
               '<div class="para" style="text-align:right"><span style="font-size:16px;color:#212121"><i>Hello World!</i></span></div>';

medt.contentEditable=true;

medt.style.textAlign="left"

var edtor = new edt(medt);

console.log(edtor);
