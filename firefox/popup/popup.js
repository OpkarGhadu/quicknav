// Polyfill for browser compatibility
if (typeof browser === "undefined") {
  var browser = (typeof chrome !== "undefined") ? chrome : {};
}

function openMenu() {
  // Send message to open popup
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, { command: "trigger-popup" });
  });
}

function openOptions() {
  /* 
    Runtime.openOptionsPage() is a built-in runtime function.
    It opens the options page as defined in manifest.json under
    "options_ui"
  */
  if (browser.runtime.openOptionsPage) {
      browser.runtime.openOptionsPage();
  } else {
      // Fallback for older versions of Chrome
      window.open(browser.runtime.getURL('options.html'));
  }
  window.close();
}

function initializePage() {
  // Assign version number to popup
  if (browser.runtime.getManifest) {
      document.getElementById('version').textContent = ("Version: " + browser.runtime.getManifest().version);
  }
}

document.querySelector("#btn-options").addEventListener("click", openOptions);
document.querySelector("#btn-menu").addEventListener("click", openMenu);
document.addEventListener("DOMContentLoaded", initializePage);
