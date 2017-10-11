# SQEDT : a Html VisualEditor

this is my first Html Component

Here is [Demo](https://marvelsq.github.io/Sqedt/) based on 0.0.5

### Function

***

#### Finished

* default input
* drag words or paste words
* add/remove **Bold**/*Italic*/Underline/~~DELETE~~
* addCallback
  * font info (**Bold**/*Italic*/Underline/~~DELETE~~)
  * font size
  * font color
  * para align
  * specified template callback (Tag a/Tag img)
* modify layout
  * drag&drop
  * drag to add template
* add template

more function will be added

#### Coming soon

* change font size to bigger/smaller
* shortcut key cmd+i/cmd+b...

#### Planned

* layout editor

### Get Start

#### Install

```javascript
npm install sqedt
```

use it in web project, like Vue.js/React.js
```javascript
import sqedt from 'sqedt'
//or
var sqedt = require('sqedt')

let edt = document.getElementById('edt');

let edtor = new sqedt(edt);

edtor.init();
```
style in dist/style.css
```javascript
import 'sqedt/dist/style.css';
```

#### edit document
```javascript
edtor.editDoc();
```

#### command
```javascript
/**
 * @param {number} level   0:inline,1:para,2:full doc
 * @param {number} type
 * @param {string} string
 */
edtor.commadn({level:0,type:0,value:''})
```
i'm building the api for all command

#### modify layout
```javascript
edtor.editLayout();
```

#### drag template in document
the drag-edt-value is keywords
```html
<div>
  <div id="drags">
    <div class="drag-item" draggable="true" data-edt-drag="h1">Title</div>
    <div class="drag-item" draggable="true" data-edt-drag="img">Img</div>
    <div class="drag-item" draggable="true" data-edt-drag="ul">UL</div>
  </div>
</div>
<script>
let drags = document.getElementById('drags');
let {dragstart,dragend} = edt.getDragin();

drags.addEventListener('dragstart',dragstart);
drags.addEventListener('dragend',dragend);
</script>
```

you can add your own template
```javascript
edtor.addTemplate({value:'ul',innerHTML:'<ul><li>item 1</li><ul>'});
```

#### addCallback
type

1 is selection status, value is { inline, para, full} style

2 is template callback, value is element instance
```javascript
/**
 * @param {number}  type
 * @param {object}  value   
 */
edtor.addCallback(({type,value})=>{
  if(type == 2){
    // img callback
    if(value.classList.contains('img')){
      let img = value.getElementsByTagName('img')[0];
      let newurl = prompt("input img url", img.src);
      img.src = newurl?newurl:img.src;
    }
  }
});
```

***
to be continue


### Learning

***

i'm still learning JS and other front-end stuff
