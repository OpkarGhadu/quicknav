// Initialize the About Page

function initializePage(){
    // Get version number from the manifest
    document.getElementById('aboutVersionNumber').textContent = browser.runtime.getManifest().version;
}


document.addEventListener("DOMContentLoaded", initializePage);