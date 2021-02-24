// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/contextMenus/global_context_search/

function createForm() {
  chrome.storage.sync.get(['removedContextMenu'], (list) => {
    let removed = list.removedContextMenu || [];
    let form = document.getElementById('form');
    for (let key of Object.keys(kLocales)) {
      let div = document.createElement('div');
      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      if (removed.includes(key)) {
        checkbox.checked = false;
      }
      checkbox.name = key;
      checkbox.value = kLocales[key];
      let span = document.createElement('span');
      span.textContent = kLocales[key];
      div.appendChild(checkbox);
      div.appendChild(span);
      form.appendChild(div);
    }
  });
}

createForm();

document.getElementById('optionsSubmit').onclick = () => {
  let checkboxes = document.getElementsByTagName('input');
  let removed = [];
  for (i=0; i<checkboxes.length; i++) {
    if (checkboxes[i].checked == false) {
      removed.push(checkboxes[i].name);
    }
  }
  chrome.storage.sync.set({removedContextMenu: removed});
  window.close();
}