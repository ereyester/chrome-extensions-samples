// ref https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/contentSettings/

let incognito;
let url;

function settingChanged() {
  const type = this.id;
  const setting = this.value;
  const pattern = /^file:/.test(url) ? url : url.replace(/\/[^\/]*?$/, '/*');
  console.log(`${type} setting for ${pattern}: ${setting}`);
  
  // HACK: [type] is not recognised by the docserver's sample crawler, so
  // mention an explicit
  // type: chrome.contentSettings.cookies.set - See http://crbug.com/299634
  chrome.contentSettings[type].set({
        'primaryPattern': pattern,
        'setting': setting,
        'scope': (incognito ? 'incognito_session_only' : 'regular')
      });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query(
    {active: true, currentWindow: true}, 
    (tabs) => {
      const current = tabs[0];
      incognito = current.incognito;
      url = current.url;
      const types = [
        'cookies', 'images', 'javascript', 'location', 'popups', 'notifications',
        'microphone', 'camera', 'automaticDownloads'
      ];
      
      for (const type of types) {
        // HACK: [type] is not recognised by the docserver's sample crawler, so
        // mention an explicit
        // type: chrome.contentSettings.cookies.get - See http://crbug.com/299634
        chrome.contentSettings[type] && chrome.contentSettings[type].get(
          {
            'primaryUrl': url,
            'incognito': incognito
          },
          (details) => {
            document.getElementById(type).disabled = false;
            document.getElementById(type).value = details.setting;
          }
        );
      }
    }
  );

  const selects = document.querySelectorAll('select');
  for (const value of selects) {
    value.addEventListener('change', settingChanged);
  }
});