// CUSTOMIZE PAGE 

// General Error Message
function onError(error) {
  console.log('Customize: Error', error);
}

// Will reset customize page to default values specified in constants.js, then save
function resetCustomizePage(){
  console.log('Customize: Resetting Values');
  // Reset Image
  document.getElementById('addNone').checked = true;
  document.getElementById('imageInput').style.display = 'none';
  document.getElementById('textInput').style.display = 'none';
  // Reset Visuals
  document.getElementById('backgroundColor').value = defaultBackgroundColor;
  document.getElementById('textColor').value = defaultTextColor;
  document.getElementById('secondaryColor').value = defaultSecondaryColor;
  
  // Reset General
  document.getElementById('username').value = defaultUsername;
  document.getElementById('timer').value = defaultTimerLength;
  document.getElementById('keyboardShortcut').textContent = defaultKeyboardShortcut;
  saveCustomizePage();
}

// Will save values on customize page to local storage under 'customize'
function saveCustomizePage(){

  // Save Image or Text
  let selectedOption = document.querySelector('input[name="imageOptions"]:checked').value;
  let imageOrTextData = null;

  // Save the image if the user selects it
  if(selectedOption === 'Image') {
    const defaultImageSrc = defaultImageUrl;
    const imageFileInput = document.getElementById('imageFile');
    /* IF statement triggered if user uploads a new file
        Will read the uploaded file, save it's result, then call saveData */
    if (imageFileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function(event) {
          imageOrTextData = {
              type: 'Image',
              data: event.target.result,
          };
          console.log('ImgOrText: Saving new Image', imageOrTextData);
          saveData(imageOrTextData);
      };
      reader.readAsDataURL(imageFileInput.files[0]);
      // Exit the function early to wait for the FileReader to finish
      return; 
    }
    /* ELSE IF Statement triggered if user does not upload a new file, but the old on remains .
        This saves the old image despite the input not showing it. Image is sourced from preview instead */
   else if(document.getElementById('imagePreview').src !== '' && document.getElementById('imagePreview').src !== defaultImageSrc) {
      const source = document.getElementById('imagePreview').src ;
      imageOrTextData = {
        type: 'Image',
        data: source,
      };
      console.log('ImgOrText: Saving existing Image', imageOrTextData); // Log the source of the image
      saveData(imageOrTextData);
    }
    // If no image uploaded despite 'Image' being selected, use the default image
    else { 
      imageOrTextData = {
        type: 'Image',
        data: null
      };
      console.log('ImgOrText: Saving default Image', imageOrTextData); // Log the default image data
      saveData(imageOrTextData); 
    }
  } 
  // If the user selects Text, take value of input field and save it
  else if(selectedOption === 'Text'){
    const textInputField = document.getElementById('textInputField').value;
    if(textInputField.length > 0){ 
        imageOrTextData = {
          type: 'Text',
          data: textInputField
        };
    }
    // If no text uploaded despite being selected, add default
    else{
      imageOrTextData = {
        type: 'Text',
        data: defaultText
      };
    }
    console.log('ImgOrText: Saving Text', imageOrTextData); // Log the text data
    saveData(imageOrTextData);
  } 
  // If user selects none, save it
  else {
    imageOrTextData = {
      type: 'None',
      data: null
    };  
    console.log('ImgOrText: Saving None', imageOrTextData); // Log 'none' option
    saveData(imageOrTextData);
  }

  // This function takes the imageOrTextData from above, and collects the other
  //  values and saves them to local storage
  function saveData(imageOrTextData){
    // Array to store saved values
    let customize = []; 
    // Save Visuals
    let backgroundColor = document.getElementById('backgroundColor').value;
    let textColor = document.getElementById('textColor').value;
    let secondaryColor = document.getElementById('secondaryColor').value;
    // Save General
    let username = document.getElementById('username').value;
    let timer = document.getElementById('timer').value;
    let keyboardShortcut = document.getElementById('keyboardShortcut').textContent;

    // Push all values to array
    customize.push({
      backgroundColor: backgroundColor,
      textColor: textColor,
      secondaryColor: secondaryColor,
      username: username,
      timer: timer,
      keyboardShortcut: keyboardShortcut,
      imageOrTextData: imageOrTextData,
    });

    // Save the customize array
    browser.storage.local.set({
      customize: customize
    }).then(
      function(){
        console.log('Customize: Saving Values', customize);
      }, onError
    ); 
    }
}

// This function is called on startup and loads the saved values
function loadCustomizePage(){
  // Checks if there is a save called 'customize, then loads its values into the page
  browser.storage.local.get("customize").then(
    function(item){
      if(item){
        const customize = item.customize;
        console.log('Customize: Loading Page', customize);
        if(customize){
          // Load Image or Text
          const imageOrText = customize[0].imageOrTextData;
          if (imageOrText!== null && imageOrText.type === 'Image' ) {
              document.getElementById('addImageToggle').checked = true;
              document.getElementById('imageInput').style.display = 'block';
              document.getElementById('textInput').style.display = 'none';
              document.getElementById('imagePreview').src = imageOrText.data;
              // add selected value here
          } else if (imageOrText!== null && imageOrText.type === 'Text') {
              document.getElementById('addTextToggle').checked = true;
              document.getElementById('imageInput').style.display = 'none';
              document.getElementById('textInput').style.display = 'block';
              document.getElementById('textInputField').value = imageOrText.data;
          } else {
              document.getElementById('addNone').checked = true;
              document.getElementById('imageInput').style.display = 'none';
              document.getElementById('textInput').style.display = 'none';
          }
          // Load Visuals
          document.getElementById('backgroundColor').value = customize[0].backgroundColor;
          document.getElementById('textColor').value = customize[0].textColor;
          document.getElementById('secondaryColor').value = customize[0].secondaryColor;
          // Load General
          document.getElementById('username').value = customize[0].username;
          document.getElementById('timer').value = customize[0].timer;
          document.getElementById('keyboardShortcut').textContent = customize[0].keyboardShortcut;
        }
      }
    }, onError
  );
}


// Event Listener that checks if user checked radio button to to add an image
//  If so, will display imageInput div. Otherwise, will hide it
document.getElementById('addImageToggle').addEventListener('change', function(){
  const imageInputDiv = document.getElementById('imageInput');
  if(this.checked){
    imageInputDiv.style.display = 'block';
  } 
  else {
    imageInputDiv.style.display = 'none';
    document.querySelector('.image-preview').style.display = 'none';
    document.getElementById('imageFile').value = '';
    document.getElementById('imagePreview').src = '';
  }
});

// Will check if the user changes the imageFile that is uploaded. If so,
//  will show a preview of the image
document.getElementById('imageFile').addEventListener('change', function(){
  const file = this.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('imagePreview').src = e.target.result;
      document.querySelector('.image-preview').style.display = 'block';
    }
    reader.readAsDataURL(file);
  } else {
    console.log('Customize: Unsupported File Type');
  }
});




// Build Page
document.addEventListener('DOMContentLoaded', (event) => { 
  // Listeners for the reset and save button
  document.getElementById('resetCustomize').addEventListener('click', resetCustomizePage);
  document.getElementById('saveCustomize').addEventListener('click', saveCustomizePage);
  // Load saved values
  loadCustomizePage();

  // Get radio buttons
  const imageRadio = document.getElementById('addImageToggle');
  const textRadio = document.getElementById('addTextToggle');
  const noneRadio = document.getElementById('addNone');
  const imageInput = document.getElementById('imageInput');
  const textInput = document.getElementById('textInput');

  function toggleInputs() {
    if (imageRadio.checked) {
        imageInput.style.display = 'block';
        textInput.style.display = 'none';
    } else if (textRadio.checked) {
        imageInput.style.display = 'none';
        textInput.style.display = 'block';
    } else {
        imageInput.style.display = 'none';
        textInput.style.display = 'none';
    }
  }

  imageRadio.addEventListener('change', toggleInputs);
  textRadio.addEventListener('change', toggleInputs);
  noneRadio.addEventListener('change', toggleInputs);

  // Initialize the display based on the default selected option
  toggleInputs();
 
});

