function PersistFind() {
  var self = this;
	self.port = chrome.runtime.connect({
		name: 'content'
	});
	self.data = {
		'find_string': ''
	};
	var li_ozfeed = document.getElementById("ozfeed")
	if(li_ozfeed) {
	  self.li_feed = li_ozfeed.getElementsByClassName("feed")[0];
	} else {
	  self.li_feed = null;
	}
  self.hilitor = new Hilitor(document.body, 'HILITE');
  self.hilitor.setMatchType('open');

  if(self.li_feed !== null) {
    self.observer = new MutationObserver(function(mutations) {
      self.observer.disconnect();
      self.hilitor.apply(self.data['find_string']);
      if(self.hilitor.firstResult !== null) {
        self.hilitor.firstResult.scrollIntoView(true);
      }
      self.observer.observe(self.li_feed, {
        childList: true
      });
    });
    self.observer.observe(self.li_feed, {
      childList: true
    });
  } else {
    self.observer = null;
  }

	function onMessageCallback(message) {
		for(var key in message) {
			self.data[key] = message[key];
		}
		if(self.observer !== null) {
		  self.observer.disconnect();
		}
    self.hilitor.apply(self.data['find_string']);
    if(self.hilitor.firstResult !== null) {
      self.hilitor.firstResult.parentElement.scrollIntoView(false);
    }
    if(self.observer !== null) {
      self.observer.observe(self.li_feed, {
        childList: true
      });
    }
	}
	self.port.onMessage.addListener(onMessageCallback);
}

var persistfind = null;

setTimeout(function() {
  persistfind = new PersistFind();
}, 1000);

