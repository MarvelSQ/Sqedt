# SQEDT : a Html VisualEditor

this is my first Html Component

### Function

***

* add/remove **BOLD**/*ITALIC*/~~STRIKE~~
* change font size by Num
* change font size to bigger/smaller
* change font color

more function will be added

### Get Start

***

start
```html
<div id="editor"></div>
<script src="sqedt/sqedt.js"></script>
<script>
    let editor = document.getElementById('editor');
    let myEdt = new SQEdt({el:editor});
</script>
```

**bold/italic/strike**
```html
<button onclick="myEdt.bold()"><b>Bold</b></button>
<button onclick="myEdt.italic()"><i>Italy</i></button>
<button onclick="myEdt.strike()"><s>Slash</s></button>
```

**bigger/smaller font size**
```html
<button onclick="myEdt.bigger()">A+</button>
<button onclick="myEdt.smaller()">A-</button>
```

**change font color/size**
```html
<select id="font">
    <option>12</option>
    <option>14</option>
    <option selected>16</option>
    <option>18</option>
    <option>20</option>
</select>
<select id="color">
    <option value="#ff0000">red</option>
    <option value="#0000ff">blue</option>
    <option value="#00ff00">green</option>
    <option value="#000000">black</option>
    <option value="#888888">grey</option>
</select>
<script>
    let fontChanger = document.getElementById('font');
    let colorChanger = document.getElementById('color');
    fontChanger.addEventListener('change',function (e) {
        myEdt.changeTag({font:Number(this.value)})
    });
    colorChanger.addEventListener('change',function (e) {
        myEdt.changeTag({color:this.value});
    });
</script>
```


### Learning

***

i'm still learning JS and other front-end stuff
