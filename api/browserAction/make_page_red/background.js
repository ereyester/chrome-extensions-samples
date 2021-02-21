// ref https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/browserAction/make_page_red/

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener((tab) => {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});