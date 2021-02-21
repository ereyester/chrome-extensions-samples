// ref https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/api/commands

chrome.commands.onCommand.addListener((command) => {
  console.log('onCommand event received for message: ', command);
});