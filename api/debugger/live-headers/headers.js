// https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/api/debugger/live-headers

const tabId = parseInt(window.location.search.substring(1));

window.addEventListener("load", () => {
  chrome.debugger.sendCommand({tabId:tabId}, "Network.enable");
  chrome.debugger.onEvent.addListener(onEvent);
});

window.addEventListener("unload", () => {
  chrome.debugger.detach({tabId:tabId});
});

let requests = {};

function onEvent(debuggeeId, message, params) {
  if (tabId != debuggeeId.tabId)
    return;

  if (message == "Network.requestWillBeSent") {
    let requestDiv = requests[params.requestId];
    if (!requestDiv) {
      requestDiv = document.createElement("div");
      let urlLine = document.createElement("div");
      
      requestDiv.className = "request";
      requests[params.requestId] = requestDiv;
      urlLine.textContent = params.request.url;
      requestDiv.appendChild(urlLine);
    }

    if (params.redirectResponse)
      appendResponse(params.requestId, params.redirectResponse);

    let requestLine = document.createElement("div");
    requestLine.textContent = `\n ${params.request.method} ${parseURL(params.request.url).path} HTTP/1.1`;
    requestDiv.appendChild(requestLine);
    document.getElementById("container").appendChild(requestDiv);
  } else if (message == "Network.responseReceived") {
    appendResponse(params.requestId, params.response);
  }
}

function appendResponse(requestId, response) {
  var requestDiv = requests[requestId];
  requestDiv.appendChild(formatHeaders(response.requestHeaders));

  var statusLine = document.createElement("div");
  statusLine.textContent = `\nHTTP/1.1 ${response.status} ${response.statusText}`;
  requestDiv.appendChild(statusLine);
  requestDiv.appendChild(formatHeaders(response.headers));
}

function formatHeaders(headers) {
  var text = "";
  for (let name in headers)
    text += name + ": " + headers[name] + "\n";
  var div = document.createElement("div");
  div.textContent = text;
  return div;
}

function parseURL(url) {
  var result = {};
  var match = url.match(
      /^([^:]+):\/\/([^\/:]*)(?::([\d]+))?(?:(\/[^#]*)(?:#(.*))?)?$/i);
  if (!match)
    return result;
  result.scheme = match[1].toLowerCase();
  result.host = match[2];
  result.port = match[3];
  result.path = match[4] || "/";
  result.fragment = match[5];
  return result;
}