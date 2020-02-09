let slider = document.getElementById('delay');
let sliderText = document.getElementById('delayVal');

slider.step = `25`;

chrome.storage.local.get('delay', data => {        // Pull the saved delay from chrome's localstorage
    slider.value = data.delay;
    sliderText.innerHTML = `Delay: ${slider.value}ms`;      // Update the display text
});

slider.oninput = () => {       // Gets called when slider is moved
    let filter = getComputedStyle(slider).getPropertyValue('--slider-filter');  // Pull the current colour filter from a css variable, looks like - "hue-rotate(0deg)"
    filter = filter.replace(/\d+/g, val => parseInt(val) + 4);       // Add 4 to the filter
    slider.style.setProperty('--slider-filter', filter);        // Update the variable

    sliderText.innerHTML = `Delay: ${slider.value}ms`;  // Update the display text
    chrome.storage.local.set({'delay': slider.value});   // Update the localstorage value
};