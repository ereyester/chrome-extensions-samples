// ref https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/browserAction/set_page_color/

const divs = document.querySelectorAll('div');

function click(e) {
  chrome.tabs.executeScript(null,
      {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
  window.close();
}

for (let i = 0; i < divs.length; i++) {
  divs[i].addEventListener('click', click);
}
