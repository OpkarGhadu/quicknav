
// Polyfill for browser compatibility
if (typeof browser === "undefined") {
  var browser = chrome;
}

/*  This file is for the popup, which looks like 
            _____________________
    Page:   |        |   Header |
            |  Img/  |   Links  |
            |  Text  |   Footer |
            |________|__________|
*/

function onError(error) {
  console.log(error);
}


// Get Data to display
function findUrlByShortcut(shortcut) {
  console.log('Content: Finding the URL');
  const savedEntries = localStorage.getItem('entries');
  if (savedEntries) {
      const entries = savedEntries;
      for (let entry of entries) {
          if (entry.shortcut === shortcut) {
              return entry.url;
          }
      }
  }
  return null;
}

async function getShortcuts(){
  try {
      let ans = [];
      let item = await browser.storage.local.get("entries")
      if(item && item.entries !== null ){
          const entries = item.entries;
          console.log('Content: Loading Shortcuts', entries);
          for(let entry of entries) {
                ans.push({
                  "shortcut": entry.shortcut, 
                  "urlName": entry.urlName,
                  "url": entry.url
                });
          };
          return ans;
      } else {
        return [];
      }
  } catch (error) {
    console.log('Shortcut Error', error);
    return [];
  }
}


//
async function getCustomizePage(){
  try {
    let item = await browser.storage.local.get("customize");
    if(item && item.customize){
      console.log('Content: Customizing Page', item.entries);
      return item.customize;
    } else {
      console.log('Content: No Custom Page.');
      return;
    }
  } catch (error) {
    console.log('Content: Failed to Customize Page');
    return
  }
}


function fitAsciiArtToWidth(container, art) {
  const preElement = document.createElement('pre');
  preElement.style.width = '100%';
  preElement.style.overflowWrap = 'break-word';
  preElement.style.fontFamily = 'monospace';
  preElement.style.whiteSpace = 'pre';
  preElement.textContent = art;

  let fontSize = 20;
  const minFontSize = 5;
  const step = 0.5;
  let iterations = 0;
  const maxIterations = 20;

  preElement.style.fontSize = `${fontSize}px`;
  container.appendChild(preElement);

  let containerWidth = container.clientWidth;

  const tempElement = document.createElement('div');
  tempElement.style.position = 'absolute';
  tempElement.style.minWidth = '200px'; // Adjust min width as needed for accurate measurement
  tempElement.style.visibility = 'hidden';
  tempElement.style.whiteSpace = 'pre';
  tempElement.style.fontFamily = 'monospace';
  tempElement.textContent = art;
  document.body.appendChild(tempElement);

  let tempWidth = tempElement.offsetWidth;

  while (tempWidth > containerWidth && fontSize > minFontSize && iterations < maxIterations) {
      fontSize -= step;
      preElement.style.fontSize = `${fontSize}px`;
      tempElement.style.fontSize = `${fontSize}px`;

      // Update container width
      containerWidth = container.clientWidth;
      tempWidth = tempElement.offsetWidth;

      iterations++;
  }

  document.body.removeChild(tempElement);
}

// This function gets, styles, and builds the elements /////////////////////////////////////
// of the popup
async function displayPopup() {
  // Get Links and Custom Values
  const entries = await getShortcuts();
  const customize = await getCustomizePage();

  // Map of Shortcut key to link
  var shortcutKeyToURL = {};
  // All Page Sections
  const popup = document.createElement("div");
  const imgOrText = document.createElement("div");
  const menuPage = document.createElement('div');
  const header = document.createElement("div");
  const links = document.createElement("div");
  const footer = document.createElement("div");
  let hasImageOrText = false;

  
  // Default Values
  let backgroundColor = "#251621";
  let textColor = "#d6c8a1";
  let secondaryColor = "#73a3ad";
  let username = "user";
  let timer = 3000;

  // Get custom values if they exist
  if (customize) {
      // Customize Visuals
      backgroundColor = customize[0].backgroundColor
      textColor = customize[0].textColor ;
      secondaryColor = customize[0].secondaryColor ;
      // Load General
      username =  customize[0].username ;
      timer = customize[0].timer * 1000 ;
      // Load Image or Text
      const imageOrText = customize[0].imageOrTextData;
      if (imageOrText.type === 'Image') {
          hasImageOrText = true;
          const image = document.createElement('img');
          image.src = imageOrText.data;
          image.alt = 'Please select an image.';
          //image.style.objectFit = 'cover';
          
          
          image.style.width = "auto";
          image.style.height = "auto";
          image.style.maxWidth = "100%";
          
          image.style.maxHeight = "100%";
          //image.style.minHeight = "200px";
          
          imgOrText.style.marginRight = "25px";
          imgOrText.style.objectFit = 'cover';
          imgOrText.style.maxWidth = '100%';
          imgOrText.style.display = 'flex';
          imgOrText.style.justifyItems = 'center';
          imgOrText.appendChild(image);
      } else if (imageOrText.type === 'Text') {
          // Ascii art
          hasImageOrText = true;
          const text = document.createElement('div');
          text.style.fontSize = '20px';
          const art = imageOrText.data;
          // Fit art to text containers
          fitAsciiArtToWidth(text, art);

          // Set container width
          text.style.maxWidth = '100%';
          text.style.display = 'flex';
          text.style.justifyItems = 'center';
          //text.style.minHeight = '200px';
          imgOrText.style.display = 'flex';
          imgOrText.style.justifyItems = 'center';
          imgOrText.style.marginRight = "25px";
          imgOrText.style.overflow = 'hidden';
          imgOrText.style.maxWidth = '100%';
          imgOrText.appendChild(text);
      }
  }

  // Style Overall Popup 
  popup.style.backgroundColor = backgroundColor;
  popup.style.color = textColor;
  popup.style.fontSize = '16px';
  popup.style.fontFamily = 'monospace';
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.paddingLeft = "20px";
  popup.style.paddingRight = '20px';
  popup.style.paddingTop = '25px';
  popup.style.paddingBottom = '25px';
  popup.style.border = "1px solid black";
  popup.style.display = "flex";
  popup.style.justifyContent = 'center';
  popup.style.zIndex = "9999";
  /////////////////////

  if(hasImageOrText){
    popup.style.minWidth = '40%';
    popup.style.minHeight = '30%';
    imgOrText.style.width = '50%';
    menuPage.style.width = "50%";
  } else {
    popup.style.minWidth = '20%';
    popup.style.minHeight = '30%';
    imgOrText.style.width = '0%';
    menuPage.style.width = "100%";
  }
  popup.style.width = 'auto';
  popup.style.height = 'auto';
  popup.style.maxHeight = '50%';
  //popup.style.maxWidth = '80%';


  // Close Button///////////////////////////////////////////////////////
  /*
  // Create the close button container
  const closeSection = document.createElement('div');
  closeSection.style.width = '100%';
  closeSection.style.textAlign = 'right';

  // Create the close button element
  const closeButton = document.createElement('img');
  closeButton.src = '../icons/closeButton.svg'; // replace with your actual path
  closeButton.alt = 'X';
  closeButton.style.cursor = 'pointer';
  closeButton.style.width = '24px'; // adjust size if needed
  closeButton.style.height = '24px';

  // Append the close button to the close button section
  closeSection.appendChild(closeButton);

  // Append the close button section to the popup
  header.appendChild(closeSection);
  */
  /////////////////////////////////////////////////////////////////////////
  
  // Style Header
  const title = document.createElement("p");
  const fullTitle = `${username.toLowerCase()}@quicknav`
  title.textContent =  fullTitle;
  title.style.margin = 0;

  const underline = document.createElement('div');
  underline.textContent = '-'.repeat(fullTitle.length);

  header.appendChild(title);
  header.appendChild(underline);
  header.style.marginBottom = '5px';

  
  // Style Links
  links.style.display = "flex";
  links.style.flexDirection = "column";
  links.style.flexGrow = "1";
  links.style.overflowY = 'auto';
  links.style.scrollbarColor = secondaryColor;
  links.style.scrollbarWidth = 'thin';
  links.style.height = '80%'
  if (entries.length > 0) {
    for (let entry of entries) {
      let url = entry.url;
      if (!/^https?:\/\//i.test(url)) {
          url = 'http://' + url; // Prepend 'http://' if the URL does not start with 'http://' or 'https://'
      }
        
      const link = document.createElement('div');
        
      // Create the shortcut span
      const shortcutSpan = document.createElement('span');
      shortcutSpan.textContent = `[${entry.shortcut}]: `;
      shortcutSpan.style.fontWeight = 'bold';
      shortcutSpan.style.color = secondaryColor;
      shortcutSpan.style.textDecoration = 'none';
      shortcutSpan.style.cursor = 'pointer';
      
      // Create the URL link (a element)
      const urlLink = document.createElement('a');
      urlLink.textContent = entry.urlName;
      urlLink.href = entry.url;
      urlLink.style.color = textColor;
      urlLink.style.textDecoration = 'none'; // Optional: remove underline
      urlLink.style.cursor = 'pointer';

      // Append the Shortcut and URL to link
      link.appendChild(shortcutSpan);
      link.appendChild(urlLink);

      link.onclick = function() {
        window.open(url, '_blank'); // Open the URL in a new tab
      };
        
      // Add the entry to the map so that shortcut links to fixed url
      shortcutKeyToURL[entry.shortcut] = url;

      links.appendChild(link)
  }
  
  } else {
    const noEntries = document.createElement('div');
    noEntries.textContent = 'No Entries';
    links.appendChild(noEntries);
  }

  // Ensure the `color.js` library is loaded and use it to extract prominent colors
  if(hasImageOrText) {

  // Extract the most prominent colors from the image
  try {
    // If Image, get color from image
      
    // Create the color bar in the footer
    footer.style.height = '10%';
    footer.style.marginTop = '5px';
    const colorBar = document.createElement('div');
    colorBar.style.display = 'flex';
    
    if(customize[0].imageOrTextData.type === 'Image') {
      // URL of the image you want to analyze
      const imageUrl = customize[0].imageOrTextData.data; // Replace with your image URL
      const prominentColors = await colorjs.prominent(imageUrl, { amount: 7 }); // Extract top 5 prominent colors
      // Add each prominent color as a square in the color bar
      prominentColors.forEach(color => {
        const square = document.createElement('div');
        square.style.height = '20px';
        square.style.width = '20px';
        square.style.backgroundColor = `rgb(${color.join(',')})`; // Convert RGB array to CSS color
        //square.style.marginRight = '5px'; // Optional: Add some spacing between squares
        colorBar.appendChild(square);
      });
    }

    // Add other colors
    let colors = [textColor, secondaryColor];
    for(let color of colors){
      let square = document.createElement('div');
      square.style.height = '20px';
      square.style.width = '20px';
      square.style.backgroundColor = color;
      colorBar.appendChild(square);
    }

    footer.appendChild(colorBar);
  } catch (error) {
    console.error('Error extracting prominent colors:', error);
  }
  };



  // Build Right Side Menu
  menuPage.style.display = "flex";
  menuPage.style.flexDirection = "column";
  menuPage.appendChild(header);
  menuPage.appendChild(links);
  menuPage.appendChild(footer);

  // Build Popup
  if (hasImageOrText) {
    popup.appendChild(imgOrText);
  } 
  popup.appendChild(menuPage);
  


  
  document.body.appendChild(popup);

/////////////////////////////////////////////
/* 
-- HOW TO ADD LINKS HOTKEY
make sure only one length and unique key
add keys to a set, check if keypress in set
- redirect to link
*/
  // Keyboard shortcut to Url map is stored in shortcutKeyToURL
  // Event listener for 'x' key
  let isKeyDown = 0;
  function openPage(event){
    if (event.key in shortcutKeyToURL && isKeyDown === 0) {
      isKeyDown = 1;

      // Send a message to the background script to open new tab
      browser.runtime.sendMessage({
        type:'keyPressed',
        url: shortcutKeyToURL[event.key]
      });
    }
    // Reset ability to keypress
    setTimeout(() => {
      isKeyDown = 0;
    }, 1000);
  }

  document.addEventListener('keydown', openPage);

///////////////////////////////////////////////
  // Close popup after a certain time
  setTimeout(() => {
      document.removeEventListener('keydown', openPage);
      document.body.removeChild(popup);
  }, timer); // Remove popup after 3 seconds

  /* Close Button Pressed
  closeButton.addEventListener('click', () => {
    document.removeEventListener('keydown', openPage);
    document.body.removeChild(popup); 
  });
  */
}



browser.runtime.onMessage.addListener((message) => {
  if (message.command === "trigger-popup") {
    displayPopup();
  }
});
