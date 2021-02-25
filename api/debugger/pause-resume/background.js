// https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/api/debugger/pause-resume

let attachedTabs = {};
const version = "1.0";

chrome.debugger.onEvent.addListener(onEvent);
chrome.debugger.onDetach.addListener(onDetach);

chrome.action.onClicked.addListener((tab) => {
  const tabId = tab.id;
  const debuggeeId = {tabId:tabId};

  if (attachedTabs[tabId] == "pausing")
    return;

  if (!attachedTabs[tabId])
    chrome.debugger.attach(debuggeeId, version, onAttach.bind(null, debuggeeId));
  else if (attachedTabs[tabId])
    chrome.debugger.detach(debuggeeId, onDetach.bind(null, debuggeeId));
});

function onAttach(debuggeeId) {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }

  var tabId = debuggeeId.tabId;
  chrome.action.setIcon({tabId: tabId, path:"debuggerPausing.png"});
  chrome.action.setTitle({tabId: tabId, title:"Pausing JavaScript"});
  attachedTabs[tabId] = "pausing";
  chrome.debugger.sendCommand(
      debuggeeId, "Debugger.enable", {},
      onDebuggerEnabled.bind(null, debuggeeId));
}

function onDebuggerEnabled(debuggeeId) {
  chrome.debugger.sendCommand(debuggeeId, "Debugger.pause");
}

function onEvent(debuggeeId, method) {
  const tabId = debuggeeId.tabId;
  if (method == "Debugger.paused") {
    attachedTabs[tabId] = "paused";
    chrome.action.setIcon({tabId:tabId, path:"debuggerContinue.png"});
    chrome.action.setTitle({tabId:tabId, title:"Resume JavaScript"});
  }
}

function onDetach(debuggeeId) {
  const tabId = debuggeeId.tabId;
  delete attachedTabs[tabId];
  chrome.action.setIcon({tabId:tabId, path:"debuggerPause.png"});
  chrome.action.setTitle({tabId:tabId, title:"Pause JavaScript"});
}
