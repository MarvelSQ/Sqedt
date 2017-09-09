var edt = require('./index')

console.log('loading');

var medt = document.getElementById('edt');

var textNum = document.getElementById('text-num')

var edtor = new edt(medt);

var slState = edtor.slState;

edtor.addCallback(function(state) {
  console.log('web', state);
  if (state.allB) {
    btnMap['00'].classList.add('active');
  } else {
    btnMap['00'].classList.remove('active');
  }
  if (state.allI) {
    btnMap['01'].classList.add('active');
  } else {
    btnMap['01'].classList.remove('active');
  }
  if (state.allU) {
    btnMap['02'].classList.add('active');
  } else {
    btnMap['02'].classList.remove('active');
  }
  if (state.allD) {
    btnMap['03'].classList.add('active');
  } else {
    btnMap['03'].classList.remove('active');
  }
  if(state.allColor){
    var code = colorMap[state.colors[0].toUpperCase()];
    if(code){

      btnMap[code].classList.add('active')
    }
  }

  sizeInput.value = state.sizes[0]
  textNum.innerHTML = state.textNum==0?medt.innerText.length:state.textNum;
})

var arr = [].slice.call(document.getElementsByClassName('tool-btn'));

var sizeInput = document.getElementsByClassName('tool-input')[0]

var codeMap = {}

var btnMap = {}

var colors = {}

var justifys = []

function changeState(id, el) {
  if (id < 10) {
    return changeTagState(id, el);
  } else if (id < 20) {
    colors[]
    return changeColorState(id, el);
  } else if (id < 30) {
    justifys.push(el);
    return changeJustifyState(id, el);
  } else if (id >= 30) {
    return changeSizeState(id, el);
  }
}

function changeTagState(id, el) {
  var key = codeMap[id]
  return function() {
    var btn = el;
    slState[key] = !slState[key]
  }
}

function changeColorState(id, el) {
  return function() {
    var btn = el;

  }
}

function changeJustifyState(id, el) {
  return function() {
    var btn = el;

  }
}

function changeSizeState(id, el) {
  return function() {
    var btn = el;

  }
}

var lastSize = 16;

sizeInput.addEventListener('change', function(e) {
  if (/\d/.test(this.value)) {
    lastSize = this.value;
    //do something
  } else {
    this.value = lastSize;
  }
})

arr.forEach(function(el, index) {
  var id = el.dataset.id
  btnMap[id] = el
  el.addEventListener('click', changeState(id, el))
})

console.log(btnMap);

medt.innerHTML = '<div class="para" style="text-align:left"><span style="font-size:16px;color:#212121"><b>Hello World!</b></span></div>' +
  '<div class="para" style="text-align:center"><span style="font-size:16px;color:#23B6EA">Hello World!</span></div>' +
  '<div class="para" style="text-align:right"><span style="font-size:16px;color:#212121"><i>Hello World!</i></span></div>'+
  '<div class="para" style="text-align:justify"><span style="font-size:16px;color:#E54343"><u>Hello World!</u></span></div>';

console.log(edtor);

textNum.innerHTML = medt.innerText.length

medt.addEventListener('input',function(){
  textNum.innerHTML = this.innerText.length;
})
