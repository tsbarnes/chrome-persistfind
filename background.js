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