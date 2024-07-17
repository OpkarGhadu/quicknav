// Polyfill for browser compatibility
if (typeof browser === "undefined") {
  var browser = chrome;
}


function onError(error) {
    console.log('Shortcuts Error', error);
  }
  
  
  function addEntry() {
      const shortcutInput = document.getElementById('shortcut-input');
      const urlInput = document.getElementById('url-input');
      const urlNameInput = document.getElementById('name-input');
      const shortcut = shortcutInput.value.trim().toLowerCase();
      const urlName = urlNameInput.value.trim();
      const url = urlInput.value.trim();
  
      if (shortcut === '' || url === '' || urlName === '') {
          alert('Please enter a keyboard shortcut and a URL Name and a URL.');
          return;
      }
  
      addTableRow(shortcut, urlName, url);
  
      // Clear input fields
      shortcutInput.value = '';
      urlNameInput.value = '';
      urlInput.value = '';
      
      // Autosave when new item added?
      saveEntries();
  }
  
  function addTableRow(shortcut, urlName, url) {
      const tableBody = document.getElementById('entry-tbody');
      const newRow = tableBody.insertRow();
  
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      const cell4 = newRow.insertCell(3);
  
      cell1.textContent = shortcut;
      cell2.textContent = urlName;
      cell3.textContent = url;
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
          tableBody.deleteRow(newRow.rowIndex - 1);
          saveEntries();  // Save the updated table after deletion
      });
  
      cell4.appendChild(deleteButton);
      
  }
  
  /////////////////////////////////////////////////////////////////////////////
  
  
  function saveEntries() {
      const tableBody = document.getElementById('entry-tbody');
      const entries = [];
  
      for (let row of tableBody.rows) {
          const shortcut = row.cells[0].textContent;
          const urlName = row.cells[1].textContent;
          const url = row.cells[2].textContent;
          entries.push({ 
            shortcut: shortcut, 
            urlName: urlName, 
            url: url });
      }
      browser.storage.local.set({
        entries: entries
      }).then(
        function() {
          //browser.runtime.sendMessage("Saved Entries");
          console.log("Saved Shortcuts");
        },onError);
  }
  
  
  function loadEntries() {
      browser.storage.local.get("entries").then(
        function(item){
          if (item) {
            const entries = item.entries;
            console.log('BUILD: Loading Shortcuts', entries);
            if(entries){
              for(let entry of entries) {
                addTableRow(entry.shortcut, entry.urlName, entry.url);
            };
            }
          } else { // If no entries, load a default one
            addTableRow('q', 'QuickNav', 'https://www.github.com/opkarghadu');
          }
        }, onError);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////
  
  
  const commandName = 'toggle-feature';
  
  /**
   * Update the UI: set the value of the shortcut textbox.
   */
  async function updateUI() {
    let commands = await browser.commands.getAll();
    for (let command of commands) {
      if (command.name === commandName) {
        document.querySelector('#keyboardShortcut').value = command.shortcut;
      }
    }
  }
  
 
 /**
  * Update the UI when the page loads.
  */
 document.addEventListener('DOMContentLoaded', updateUI);
 
  document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('add-entry-button').addEventListener('click', addEntry);
    //document.getElementById('save-button').addEventListener('click', saveEntries);
    
    loadEntries();
  
    // By default, content is not displayed. Adding active makes it show
    // For the header, the active tag makes it highlighted
  
    // Get all links (header nav) and content sections (pages)
    const links = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.content');
  
    // We want each link to be a clickable event
    links.forEach(link => {
      link.addEventListener('click', function(event) {
        // This prevents page navigation, ie: the default action
        event.preventDefault();
  
        // When a link is pressed, disable all others links and pages
        links.forEach(l => l.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        // Make this link and page active
        this.classList.add('active');
        const target = document.querySelector(this.getAttribute('href'));
        target.classList.add('active');
      });
    });
  
  
    // By default, load first page
    links[0].classList.add('active');
    contents[0].classList.add('active');
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  