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
