# SQEDT : a Html VisualEditor

this is my first Html Component

Here is [Demo](https://marvelsq.github.io/Sqedt/)

### Function

***

#### Finished

* default input
* add/remove **BOLD** [bug](https://github.com/MarvelSQ/Sqedt/issues/5)
* addCallback
  * font info (**Bold**/*Italic*/Underline/~~DELETE~~)
  * font size
  * font color
  * para align

more function will be added

#### Coming soon

* more init param like minLines/lineHeight
* add/remove *ITALIC*/Underline/~~DELETE~~
* change font size by Number
* change font size to bigger/smaller
* change font color
* change paragraph align
* shortcut key cmd+i/cmd+b...

#### Planned

* clipboard
* layout editor

### Get Start

#### Install

```javascript
npm install sqedt
```

use it in web project, like Vue.js
```javascript
import sqedt from 'sqedt'
//or
var sqedt = require('sqedt')

let edt = document.getElementById('edt');

let edtor = new sqedt(edt);
```

addCallback
```javascript
/**
 * @param  {Object} state {allB:Bool,allI:Bool,allU:Bool,
 *                        allD:Bool,allColor:Bool,allSize:Bool
 *                        allJustify:Bool,justifys:Array,
 *                        colors:Array,sizes:Array,
 *                        textNum:Number}
 */
edtor.addCallback(function(state){
  //state update
  //do something like update document
})
```

***
to be continue


### Learning

***

i'm still learning JS and other front-end stuff
