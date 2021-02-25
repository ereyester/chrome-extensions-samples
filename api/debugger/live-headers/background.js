// https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/api/debugger/live-headers

chrome.action.onClicked.addListener((tab) => {
  chrome.debugger.attach({tabId:tab.id}, version,
      onAttach.bind(null, tab.id));
});

var version = "1.0";

function onAttach(tabId) {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }

  chrome.windows.create(
      {url: "headers.html?" + tabId, type: "popup", width: 800, height: 600});
}