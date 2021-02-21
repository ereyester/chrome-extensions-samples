// ref https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/browserAction/set_icon_path/

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({number: 1}, () => {
    console.log('The number is set to 1.');
  });
});

function updateIcon() {
  chrome.storage.sync.get('number', (data) => {
    var current = data.number;
    chrome.action.setIcon({path: 'icon' + current + '.png'});
    current++;
    if (current > 5)
      current = 1;
    chrome.storage.sync.set({number: current}, () => {
      console.log('The number is set to ' + current);
    });
  });
};

chrome.action.onClicked.addListener(updateIcon);
updateIcon();