/**
 * Listens for the app being installed or upgraded and updates the rules
 *
 * @see https://developer.chrome.com/extensions/pageAction
 * @see https://developer.chrome.com/extensions/declarativeContent
 */

chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires for LinkedIn and Xing
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'www.linkedin.com',
              schemes: ['http', 'https']
            },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'www.xing.com',
              schemes: ['http', 'https']
            },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

var content_scripts = [];
var data = {
  'find_string': ''
};

chrome.storage.local.get(data, function(items) {
  for(var key in items) {
    if(items[key] !== null) {
      data[key] = items[key];
    }
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  console.log("Local storage changed.");
  console.log(changes);
  if(areaName == 'local') {
    for(var key in changes) {
      data[key] = changes[key].newValue;
    }
  }
  for(var index in content_scripts) {
    content_scripts[index].postMessage(data);
  }
});

chrome.runtime.onConnect.addListener(function(port) {
  if(port.name == 'popup') {
    console.log('Popup connected to background.');
    port.postMessage(data);
  } else if(port.name == 'content') {
    console.log('Content connected to background.');
    content_scripts.push(port);
    port.onDisconnect.addListener(function(port) {
      content_scripts.splice(content_scripts.indexOf(port), 1);
    });
    port.postMessage(data);
  }
});
