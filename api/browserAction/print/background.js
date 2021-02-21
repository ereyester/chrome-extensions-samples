// ref https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/browserAction/print/

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.executeScript(
    tab.id,
    {code: 'window.print();'});
});