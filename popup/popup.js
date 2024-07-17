function openMenu(){
  // Send message to open popup
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { command: "trigger-popup" });
  });
}

function openOptions(){
  /* 
    Runtime.openOptionsPage() is a built-in runtime function.
    It opens the options page as defined in manifest.json under
    "options_ui"
  */
  browser.runtime.openOptionsPage();
  window.close();
}



function initializePage(){
  // Assign version number to popup
  document.getElementById('version').textContent = ("Version: " + browser.runtime.getManifest().version);
}

document.querySelector("#btn-options").addEventListener("click", openOptions);
document.querySelector("#btn-menu").addEventListener("click", openMenu);
document.addEventListener("DOMContentLoaded", initializePage);