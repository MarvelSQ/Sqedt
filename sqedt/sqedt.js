/**
 * Created by sun19 on 2017/7/8.
 */
// const SQEdt = {
//     createEditor: Sqedt
// }
//
// function Sqedt(ele) {
//     ele.contentEditable = true
//     ele.innerHTML = '<div class="line"><br></div>'
//     return new SqEdt(ele)
// }
//
// function SqEdt(el) {
//     this.el = el
//     this.sl = window.getSelection()
//     this.bold = function () {
//         console.log(this.sl.toString())
//         console.log('BOLD')
//     }
// }
//
// function italy() {
//     console.log('ITALY')
// }
//
// function slash() {
//     console.log('SLASH')
// }

let SQEdt = function (options) {
    if (options.el) {
        this.el = options.el
    } else {
        throw new Error('SQEdt must have a Element')
    }

    this.el.contentEditable = true;
    this.el.innerHTML = '<div class="line"><span style="font-size: 16px">asdasdasdasdasd</span><span>ertertertertert</span></div><div class="line"><span><b>asdasdasdasd</b></span></div><div class="line"><span>sadsasdasdas</span></div>';
    this.el.classList.add('sqedt');
    this.sl = window.getSelection();

    this.el.addEventListener('selectstart', function (e) {
        //console.log(e)
    });

    this.el.addEventListener('blur', function (e) {
        //console.log(e)
    });

    this.el.addEventListener('input', function (e) {
        console.log(e);
        if (e.target.innerText.length === 0) {
            e.target.innerHTML = '<div class="line"><span><br></span></div>'
        }
        for (let i = 0; i < e.target.children.length; i++) {
            if (e.target.children[i].innerHTML.indexOf('span') < 0) {
                e.target.children[i].innerHTML = '<span>' + e.target.children[i].innerHTML + '</span>'
            }
        }
    })
};

let EdtItem = function (range) {
    this.startContainer = range.startContainer;
    this.startOffset = range.startOffset;
    this.endContainer = range.endContainer;
    this.endOffset = range.endOffset;
    this.commonContainer = range.commonAncestorContainer;
    this.startParent = range.startContainer.parentNode;
    this.endParent = range.endContainer.parentNode;
};

SQEdt.prototype = {
    check: function () {
        let target = this.sl.focusNode.parentNode;
        if (target === this.el) {
            return true
        }
        let els = this.el.querySelectorAll(this.sl.focusNode.parentNode.tagName);
        for (let i = 0; i < els.length; i++) {
            if (target === els.item(i)) {
                return true
            }
        }
        return false
    },
    threeCut: function (item, range, include) {
        let c = range.cloneContents();
        range.deleteContents();
        if (include) {
            range.setStartBefore(item.commonContainer)
        } else {
            range.setStart(item.commonContainer, 0)
        }
        let f = range.cloneContents();
        range.deleteContents();
        if (include) {
            range.setEndAfter(item.commonContainer)
        } else {
            //if(range.) when commonContainer doesn't have anyChildren,some thing wrong
            if (item.commonContainer.hasChildNodes()) {
                range.setEndAfter(item.commonContainer.lastChild)
            } else {
                range.setEndBefore(item.commonContainer)
            }
        }


        let e = range.cloneContents();
        range.deleteContents();
        console.log([f, c, e]);
        return {
            before: f,
            content: c,
            after: e
        }
    },
    getLine: function (el) {
        let parent = el;
        for (let i = 0; i < 5; i++) {
            if (parent.nodeName !== 'DIV') {
                parent = parent.parentNode
            }
        }
        return parent
    },
    getSpan: function (parent, el) {
        let wrap = el;
        let tmp;
        for (let i = 0; i < 4; i++) {
            if (parent.nodeName !== 'SPAN') {
                let outer = parent.parentNode.cloneNode(false);
                parent = parent.parentNode;
                tmp = wrap;
                wrap = outer;
                wrap.appendChild(tmp)
            } else {
                if (wrap.nodeName !== 'SPAN') {
                    tmp = wrap;
                    wrap = parent.cloneNode(false);
                    wrap.appendChild(tmp)
                }
            }
        }
        return wrap
    },
    getSpanParent: function (el) {
        let parent = el;
        for (let i = 0; i < 4; i++) {
            if (parent.nodeName !== 'SPAN') {
                parent = parent.parentNode
            }
        }
        return parent
    },
    checkNodeIsAllBelong: function (node, nodename) {
        let nodes = node.querySelectorAll(nodename);
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].remove()
        }
        return node.innerText === ''
    },
    addTagInFragment: function (nodesParent, nodename) {
        for (let i = 0; i < nodesParent.childNodes.length; i++) {
            if (nodesParent.childNodes[i].innerText === '') {
                nodesParent.replaceChild(document.createTextNode(''), nodesParent.childNodes[i])
            } else {
                this.addTag(nodesParent.childNodes[i], nodename)
            }
        }
        nodesParent.normalize()
    },
    addTag: function (node, nodename) {
        return nodename === 'b' ? this.addBoldTag(node) : nodename === 'i' ? this.addItalicTag(node) : nodename === 's' ? this.addStrikeTag(node) : ''
    },
    addBoldTag: function (node) {//node must be span
        node.innerHTML = '<b>' + node.innerHTML.replace('<b>', '').replace('</b>', '') + '</b>'
    },
    addItalicTag: function (node) {//node must be span
        for (let i = 0; i < node.childNodes.length; i++) {
            let tmp = node.childNodes[i];
            if (tmp.innerText === '') {
                node.replaceChild(document.createTextNode(''), tmp)
            } else {
                if (tmp.nodeName === '#text' || tmp.nodeName === 'S') {
                    let i = document.createElement('i');
                    i.appendChild(tmp.cloneNode(true));
                    node.replaceChild(i, tmp)
                }
                if (tmp.nodeName === 'B') {
                    tmp.innerHTML = '<i>' + tmp.innerHTML.replace('<i>', '').replace('</i>', '') + '</i>'
                }
            }
        }
        node.normalize()
    },
    addStrikeTag: function (node) {//node must be span
        for (let i = 0; i < node.childNodes.length; i++) {
            let tmp = node.childNodes[i];
            if (tmp.innerText === '') {
                node.replaceChild(document.createTextNode(''), tmp)
            } else {
                if (tmp.nodeName === '#text') {
                    let s = document.createElement('s');
                    s.appendChild(tmp.cloneNode(true));
                    node.replaceChild(s, tmp)
                }
                if (tmp.nodeName === 'B' || tmp.nodeName === 'I') {
                    tmp.innerHTML = '<s>' + tmp.innerHTML.replace('<s>', '').replace('</s>', '') + '</s>'
                }
            }
        }
        node.normalize()
    },
    removeTag: function (node, nodename) {
        let s = eval('/<' + nodename + '>/g');
        let e = eval('/<\\/' + nodename + '>/g');
        node.innerHTML = node.innerHTML.replace(s, '').replace(e, '')
    },
    removeTagInFragment: function (nodeList, nodename) {
        for (let i = 0; i < nodeList.length; i++) {
            this.removeTag(nodeList[i], nodename)
        }
    },
    mergeTag: function (nodeParent) {
        for (let i = nodeParent.childNodes.length - 1; i >= 0; i--) {
            if (nodeParent.childNodes[i].nodeName === 'DIV') {
                this.mergeTag(nodeParent.childNodes[i])
            } else if (nodeParent.childNodes[i].innerText === '') {
                nodeParent.childNodes[i] = document.createTextNode('')
            } else if (nodeParent.childNodes[i].nodeName !== '#text') {
                if (i >= 1 && nodeParent.childNodes[i].nodeName === nodeParent.childNodes[i - 1].nodeName && nodeParent.childNodes[i].style.cssText === nodeParent.childNodes[i - 1].style.cssText) {
                    let len = nodeParent.childNodes[i].childNodes.length;
                    for (let index = 0; index < len; index++) {
                        nodeParent.childNodes[i - 1].appendChild(nodeParent.childNodes[i].childNodes[0])
                    }
                    nodeParent.childNodes[i].remove()
                } else {
                    this.mergeTag(nodeParent.childNodes[i])
                }
            }
        }
        nodeParent.normalize()
    },
    changeFontSizeInFragment: function (nodesParent, font) {
        for (let i = 0; i < nodesParent.childNodes.length; i++) {
            if (nodesParent.childNodes[i].innerText === '') {
                nodesParent.replaceChild(document.createTextNode(''), nodesParent.childNodes[i])
            } else {
                this.changeFontSize(nodesParent.childNodes[i], font)
            }
        }
        nodesParent.normalize()
    },
    changeFontSize: function (node, font) {
        switch (font) {
            case 'up':
                this.changeFontSizeByCount(node, true);
                break;
            case 'down':
                this.changeFontSizeByCount(node, false);
                break;
            default:
                if (typeof font === 'number') {
                    this.changeFontSizeByNum(node, font)
                }
                break
        }
    },
    changeFontSizeByCount: function (node, isUp) {
        if (node.style.fontSize !== "") {
            let change = isUp ? 1 : -1;
            node.style.fontSize = (Number(node.style.fontSize.replace('px', '')) + change) + 'px'
        } else {
            node.style.fontSize = isUp ? '17px' : '15px'
        }
    },
    changeFontSizeByNum: function (node, num) {
        node.style.fontSize = num + 'px'

    },
    changeFontColorInFragment: function (nodesParent, color) {
        for (let i = 0; i < nodesParent.childNodes.length; i++) {
            if (nodesParent.childNodes[i].innerText === '') {
                nodesParent.replaceChild(document.createTextNode(''), nodesParent.childNodes[i])
            } else {
                this.changeFontColor(nodesParent.childNodes[i], color)
            }
        }
        nodesParent.normalize()
    },
    changeFontColor: function (node, color) {
        node.style.color = color
    },

    changeTag: function (options) {
        console.log(new Date().getMilliseconds());
        if (!this.check()) {
            return
        }
        let range = this.sl.getRangeAt(0);
        let item = new EdtItem(range);
        //alert(this.sl.toString())

        let isAll = false;
        // let tmp = range.cloneContents()
        // range.deleteContents()
        // range.insertNode(tmp)
        switch (item.commonContainer.nodeName) {
            case 'DIV':
                if (item.commonContainer.classList.contains('sqedt')) {
                    let tmp = range.cloneContents();
                    // range.deleteContents()
                    // range.insertNode(tmp)

                    this.mergeTag(tmp);

                    if (options.tag) {
                        for (let i = 0; i < tmp.childNodes.length; i++) {
                            if (this.checkNodeIsAllBelong(tmp.childNodes[i].cloneNode(true), options.tag)) {
                                isAll = true
                            } else {
                                isAll = false;
                                break;
                            }
                        }
                        if (isAll) {
                            this.removeTagInFragment(tmp.childNodes, options.tag)
                        } else {
                            for (let i = 0; i < tmp.childNodes.length; i++) {
                                this.addTagInFragment(tmp.childNodes[i], options.tag)
                            }
                        }
                    }
                    if (options.font) {
                        console.log(options.font);
                        for (let i = 0; i < tmp.childNodes.length; i++) {
                            this.changeFontSizeInFragment(tmp.childNodes[i], options.font)
                        }
                    }
                    if (options.color) {
                        console.log(options.color);
                        for (let i = 0; i < tmp.childNodes.length; i++) {
                            this.changeFontColorInFragment(tmp.childNodes[i], options.color)
                        }
                    }



                    let first = tmp.childNodes[0];
                    let last = tmp.childNodes[tmp.childNodes.length - 1];
                    let start = first.children[0];
                    let end = last.children[last.children.length - 1];
                    tmp.childNodes[tmp.childNodes.length - 1].remove();
                    if (tmp.childNodes[0]) {
                        tmp.childNodes[0].remove()
                    }
                    range.deleteContents();
                    let elnum = first.children.length;
                    for (let i = 0; i < elnum; i++) {
                        this.getLine(item.startContainer).appendChild(first.children[0])
                    }
                    range.insertNode(tmp);
                    elnum = last.children.length;
                    for (let i = 0; i < elnum; i++) {
                        this.getLine(item.endContainer).insertBefore(last.children[last.children.length - 1], this.getLine(item.endContainer).firstChild)//.appendChild()
                    }
                    if (start) {
                        range.setStartBefore(start)
                    } else {
                        range.setStart(this.getLine(item.startContainer).nextElementSibling,0)
                    }
                    if(end){
                        range.setEndAfter(end)
                    }else {
                        range.setEnd(this.getLine(item.endContainer).previousElementSibling,this.getLine(item.endContainer).previousElementSibling.childNodes.length)
                    }

                } else if (item.commonContainer.classList.contains('line')) {
                    let cuts = this.threeCut(item, range, false);
                    for (let i = cuts.before.childNodes.length - 1; i >= 0; i--) {
                        if (cuts.before.childNodes[i].innerText === '') {
                            cuts.before.childNodes[i].remove()
                        }
                    }
                    for (let i = cuts.after.childNodes.length - 1; i >= 0; i--) {
                        if (cuts.after.childNodes[i].innerText === '') {
                            cuts.after.childNodes[i].remove()
                        }
                    }

                    for (let i = 0; i < cuts.content.childNodes.length; i++) {
                        if (this.checkNodeIsAllBelong(cuts.content.childNodes[i].cloneNode(true), options.tag)) {
                            isAll = true
                        } else {
                            isAll = false;
                            break;
                        }
                    }
                    if (options.tag) {
                        if (isAll) {
                            this.removeTagInFragment(cuts.content.childNodes, options.tag)
                        } else {
                            this.addTagInFragment(cuts.content, options.tag)
                        }
                    }
                    if (options.font) {
                        console.log(options.font);
                        this.changeFontSizeInFragment(cuts.content, options.font)
                    }
                    if (options.color) {
                        console.log(options.color);
                        this.changeFontColorInFragment(cuts.content, options.color)
                    }

                    item.commonContainer.appendChild(cuts.before);

                    this.mergeTag(cuts.content);

                    let slStart = cuts.content.firstChild;
                    let slEnd = cuts.content.lastChild;
                    item.commonContainer.appendChild(cuts.content);
                    item.commonContainer.appendChild(cuts.after);
                    range.setStartBefore(slStart);
                    range.setEndAfter(slEnd)
                }
                break;
            case '#text':
            case 'SPAN':
            case 'B':
            case 'I':
            case 'S':
                item.commonContainer.normalize();
                let content = this.getSpan(item.commonContainer, range.cloneContents().childNodes[0]);
                item.commonContainer = this.getSpanParent(item.commonContainer);
                let cuts = this.threeCut(item, range, true);

                if (options.tag) {
                    if (this.checkNodeIsAllBelong(content.cloneNode(true), options.tag)) {
                        this.removeTag(content, options.tag)
                    } else {
                        this.addTag(content, options.tag)
                    }
                }
                if (options.font) {
                    console.log(options.font);
                    this.changeFontSize(content, options.font)
                }
                if (options.color) {
                    console.log(options.color);
                    this.changeFontColor(content, options.color)
                }


                for (let i = cuts.before.childNodes.length - 1; i >= 0; i--) {
                    if (cuts.before.childNodes[i].innerText === '') {
                        cuts.before.childNodes[i].remove()
                    }
                }
                for (let i = cuts.after.childNodes.length - 1; i >= 0; i--) {
                    if (cuts.after.childNodes[i].innerText === '') {
                        cuts.after.childNodes[i].remove()
                    }
                }

                this.mergeTag(content);


                range.insertNode(cuts.after);
                range.insertNode(content);
                range.insertNode(cuts.before);
                //range.selectNode(content) //bug:first shift is successful,but second is wrong
                range.setStartBefore(content.firstChild);
                range.setEndAfter(content.lastChild);
                break;

        }
        this.el.focus();
        console.log(new Date().getMilliseconds())
    },
    bold: function () {
        this.changeTag({tag: 'b'})
    },
    italy: function () {
        this.changeTag({tag: 'i'})
    },
    slash: function () {
        this.changeTag({tag: 's'})
    },
    bigger: function () {
        this.changeTag({font: 'up'})
    },
    smaller: function () {
        this.changeTag({font: 'down'})
    },
    color:function (color) {
        this.changeTag({color:color})
    }
};

