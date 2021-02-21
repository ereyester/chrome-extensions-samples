// ref https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/api/browsingData/basic

const button = document.getElementById("button");
const timeframe = document.getElementById("timeframe");

function parseMilliseconds(timeframe) {
  const now = new Date().getTime();
  const milliseconds = {
    'hour': 60 * 60 * 1000,
    'day': 24 * 60 * 60 * 1000,
    'week': 7 * 24 * 60 * 60 * 1000,
    '4weeks': 4 * 7 * 24 * 60 * 60 * 1000
  };
  
  if (milliseconds[timeframe])
    return now - milliseconds[timeframe];

  if (timeframe === 'forever')
    return 0;

  return null;
}

function handleCallback() {
  var success = document.createElement('div');
  success.classList.add('overlay');
  success.setAttribute('role', 'alert');
  success.textContent = 'Data has been cleared.';
  document.body.appendChild(success);

  setTimeout(() => { success.classList.add('visible'); }, 10);
  setTimeout(() => {
    if (close === false)
      success.classList.remove('visible');
    else
      window.close();
  }, 4000);
}

function handleClick(){
  let removal_start = parseMilliseconds(timeframe.value);
  if (removal_start !== undefined) {
    button.setAttribute('disabled', 'disabled');
    button.innerText = 'Clearing...';
    
    chrome.browsingData.remove(
        {'since': removal_start}, {
          'appcache': true,
          'cache': true,
          'cacheStorage': true,
          'cookies': true,
          'downloads': true,
          'fileSystems': true,
          'formData': true,
          'history': true,
          'indexedDB': true,
          'localStorage': true,
          'serverBoundCertificates': true,
          'serviceWorkers': true,
          'pluginData': true,
          'passwords': true,
          'webSQL': true
        },
        handleCallback());
  }
}

button.addEventListener('click', () => {
  handleClick();
});
