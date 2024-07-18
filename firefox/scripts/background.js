// Background script which detects keypresses and opens popup or new tab

// Polyfill for browser compatibility
if (typeof browser === "undefined") {
  var browser = chrome;
}


// Detects shortcut keypress from popup menu
// and opens new tab using the url of the shortcut
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background: Open New Tab');
  if(message.type === 'keyPressed'){
    browser.tabs.create({
      url: message.url
    });
  }
});



// Detects if user presses key to open popup
// By default, this is Alt+Z
function checkKeypress(command){
  console.log('Background: Checking Keypress')
  if (command === "toggle-feature") {
    // Display menu
    console.log("Background: Display Menu");
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, { command: "trigger-popup" });
    });
  };
}

browser.commands.onCommand.addListener(checkKeypress);
