/**
 * [popupwindow description]
 * default{close}
 * closeWindow,showWindow
 * @type {[type]}
 */

let popupwindow = document.createElement('div');
popupwindow.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(88,88,88,0.3);';
// popupwindow.innerHTML = '<div style="margin:40px auto;width:600px;"></div>';

function closeWindow() {
  popupwindow.style.display = 'none';
}

function saveWindow() {
  let type = popupwindow.getElementsByTagName('select')[0].value;
  let num = popupwindow.getElementsByTagName('input')[0].value;
  opEl.style.width = '';
  opEl.style.height = '';
  opEl.style[type] = popupwindow.getElementsByTagName('input')[0].value;
}

function enterClick(e) {
  console.log(e);
  if (e.keyCode == 13) {
    saveWindow();
  }
}

function showPopup() {
  if (popupwindow.parentNode) {
    popupwindow.style.display = 'block';
  } else {
    document.body.appendChild(popupwindow);
  }
}

function addImg(el) {
  opEl = el;
  let html = `
    <div style="margin:40px auto;width:600px">
      <div style="margin:10px;box-shadow:0 2px 8px 1px #888;padding:8px;background-color:#fff;border-radius:4px;">
        <div style="margin-bottom:10px"><img src="${el.src}" style="width:100%"></div>
        <div>
          <select>
            <option ${el.style.width
    ? 'selected'
    : ''}>width</option>
            <option ${el.style.height
      ? 'selected'
      : ''}>height</ption>
          </select>
          <input value="${el.style.width
        ? el.style.width
        : el.style.height}" placeholder="default is 100%">
        </div>
        <div>
          <button id="edt-img-save">save</buttopn>
          <button id="edt-img-close">close</buttopn>
        </div>
      </div>
    </div>`;
  popupwindow.innerHTML = html;
  popupwindow.getElementsByTagName('input')[0].addEventListener('keyup', enterClick);
  [...popupwindow.getElementsByTagName('button')].forEach((e,i)=>e.addEventListener('click',i==0?saveWindow:closeWindow))
  // .addEventListener('click',saveWindow);
  // popupwindow.getElementById('edt-img-close').addEventListener('click',closeWindow);
}

module.exports = {
  window: popupwindow,
  closeWindow,
  saveWindow,
}
