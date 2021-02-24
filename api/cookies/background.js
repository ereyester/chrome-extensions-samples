// https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/api/cookies/

chrome.cookies.onChanged.addListener((info) => {
  console.log("onChanged" + JSON.stringify(info));
});

function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, (windows) => {
    let existing_tab = null;
    for (var i in windows) {
      const tabs = windows[i].tabs;
      for (let j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}

chrome.action.onClicked.addListener(function(tab) {
  const manager_url = chrome.runtime.getURL("manager.html");
  focusOrCreateTab(manager_url);
});