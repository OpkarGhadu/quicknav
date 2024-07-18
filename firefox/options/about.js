// The About Subpage in Options

function initializePage(){
    // Add version number from the manifest
    document.getElementById('aboutVersionNumber').textContent = browser.runtime.getManifest().version;
}

document.addEventListener("DOMContentLoaded", initializePage);