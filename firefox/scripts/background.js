// Polyfill for browser compatibility
if (typeof browser === "undefined") {
  var browser = chrome;
}

// Open Menu
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

// This recieves url from keypress
//   When keypressed, it sends url
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background: Open New Tab');
  if(message.type === 'keyPressed'){
    browser.tabs.create({
      url: message.url
    });
  }
});

