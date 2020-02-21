let slider = document.getElementById('delay');
let sliderText = document.getElementById('delayVal');
let buttonMinus = document.getElementById('delayMinus');
let buttonPlus = document.getElementById('delayPlus');

slider.step = `25`;

chrome.storage.local.get('delay', data => {        // Pull the saved delay from chrome's localstorage
    if (1000 < data.delay) {   // Make sure there's enough room for the localstorage delay
        slider.max = data.delay;
    };
    slider.value = data.delay;
    sliderText.innerHTML = `Delay: ${slider.value}ms`;      // Update the display text
});

function sliderUpdate() {       // Gets called when slider is updated
    let filter = getComputedStyle(slider).getPropertyValue('--slider-filter');  // Pull the current colour filter from a css variable, looks like - "hue-rotate(0deg)"
    filter = filter.replace(/\d+/g, val => parseInt(val) + 4);       // Add 4 to the filter
    slider.style.setProperty('--slider-filter', filter);        // Update the variable

    sliderText.innerHTML = `Delay: ${slider.value}ms`;  // Update the display text
    chrome.storage.local.set({'delay': slider.value});   // Update the localstorage value
    console.log(chrome.storage.local.get('delay'))
};

slider.oninput = sliderUpdate

buttonMinus.onclick = () => { // Gets called when minus button is pressed
    slider.value -= slider.step;   // Subtracting from the slider value
    sliderUpdate(); // Changes variables, colour etc.
    buttonPlus.removeAttribute("disabled"); // Make sure plus button is active
    if (slider.value == 0) {
        buttonMinus.setAttribute("disabled",""); // Don't go below 0
    };
};

buttonPlus.onclick = () => { // Gets called when plus button is pressed
    if (slider.value >= slider.max) { // Make sure slider doesn't max out by
        slider.max = Number(slider.max) + Number(slider.step);    // changing slider.max dynamically
    };
    slider.value = Number(slider.value) + Number(slider.step); // Adding to the slider value
    sliderUpdate(); // Changes variables, colour etc.
    buttonMinus.removeAttribute("disabled"); // Make sure minus button is active
    if (slider.value >= 10000) {
        buttonPlus.setAttribute("disabled",""); // Don't go above 10 000
    };
};