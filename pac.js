var edt = require('./index')

var medt = document.getElementById('edt');

var textNum = document.getElementById('text-num')

var edtor = new edt(medt);

var slState = edtor.slState;

var lastSize = 16;

var arr = [].slice.call(document.getElementsByClassName('tool-btn'));

var sizeInput = document.getElementsByClassName('tool-input')[0]

var codeMap = {
  'allB': '00',
  'allI': '01',
  'allU': '02',
  'allD': '03'
}

var keyMap = {
  '00': 'allB',
  '01': 'allI',
  '02': 'allU',
  '03': 'allD'
}

var btnMap = {}

var colors = [
  {
    color: '#FFFFFF',
    code: '10'
  }, {
    color: '#212121',
    code: '11'
  }, {
    color: '#E54343',
    code: '12'
  }, {
    color: '#EBE74E',
    code: '13'
  }, {
    color: '#23B6EA',
    code: '14'
  }, {
    color: '#40B883',
    code: '15'
  }
]

var justifys = [
  {
    justify: 'left',
    code: '20'
  }, {
    justify: 'center',
    code: '21'
  }, {
    justify: 'right',
    code: '22'
  }, {
    justify: 'justify',
    code: '23'
  }
];

['B', 'I', 'U', 'D'].forEach(function(key) {
  slState['all' + key] = false;
})

function getTypeByCode(type, keyWord) {
  var arr = type == 'color'
    ? colors
    : justifys;
  return arr.filter(function(e) {
    return e.code == keyWord;
  })[0][type];
}

function getCodeByType(type, keyWord) {
  var arr = type == 'color'
    ? colors
    : justifys;
  return arr.filter(function(e) {
    return e[type] == keyWord;
  })[0].code;
}

edtor.addCallback(function(state) {
  console.log('web', state);
  ['allB', 'allI', 'allU', 'allD'].forEach(function(key) {
    if (state[key] != slState[key]) {
      var tmp = btnMap[codeMap[key]].classList
      if (state[key]) {
        tmp.add('active');
      } else {
        tmp.remove('active');
      }
    }
  });
  removeAllActive('color');
  if (state.allColor) {
    btnMap[getCodeByType('color', state.colors[0].toUpperCase())].classList.add('active');
  }
  removeAllActive('justify');
  if (state.allJustify) {
    btnMap[getCodeByType('justify', state.justifys[0])].classList.add('active');
  }
  if (state.allSize) {
    sizeInput.value = state.sizes[0]
  }
  textNum.innerText = state.textNum != 0
    ? state.textNum
    : medt.innerText.replace('\n', '').length;
  slState = state;
})

function removeAllActive(type) {
  var arr = type == 'color'
    ? ['10','11','12','13','14','15']
    : ['20', '21', '22', '23'];
  arr.filter(function(id) {
    var b = btnMap[id];
    var cl = b.classList;
    return cl.contains('active');
  }).forEach(function(id) {
    console.log(id);
    console.log(btnMap);
    btnMap[id].classList.remove('active');
  })
}

function changeTagState(id, el) {
  var key = keyMap[id]
  return function() {
    console.log('btn click');
    var btn = el;
    var state = {};
    state[key]= !slState[key];
    edtor.insertNode(state)
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

function changeState(id, el) {
  btnMap[id] = el;
  if (id < 10) {
    return changeTagState(id, el);
  } else if (id < 20) {
    return changeColorState(id, el);
  } else if (id < 30) {
    justifys.push(el);
    return changeJustifyState(id, el);
  } else if (id >= 30) {
    return changeSizeState(id, el);
  }
}

arr.forEach(function(el) {
  el.addEventListener('click',changeState(el.dataset.id, el));
})

sizeInput.addEventListener('change', function(e) {
  if (/\d/.test(this.value)) {
    lastSize = this.value;
    //do something
  } else {
    this.value = lastSize;
  }
})

function getContent(){
  let htmlStr = ''
  for(let i = 0;i<1000;i++){
    htmlStr+=`<div class="para"><span style="color:#212121;font-size:36px;"><b>The MIT License (MIT)</b></span>
    <span style="color:#888888;font-size:20px;"><i>Copyright (c) 2017-present <b>Qiang Sun</b></i></span>
    <span style="color:#212121;font-size:16px;">Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files <b>(the "Software")</b>, to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</span></div>`
  }
  return htmlStr;
}


medt.innerHTML = getContent();

textNum.innerHTML = medt.innerText.length

medt.addEventListener('input', function() {
  textNum.innerHTML = this.innerText.replace('\n', '').length;
})
