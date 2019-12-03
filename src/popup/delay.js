(function(slider, sliderText) {
    slider.step = "25";

    chrome.storage.local.get(["delay"], function(data) {        // Pull the saved delay from chrome's localstorage
        let delay = data.delay;
        if (delay != undefined) {       // Default to 300ms if it doesn't exist in the localstorage
            slider.value = delay;
        } else {
            slider.value = 300;
        }
        sliderText.innerHTML = `Delay: ${slider.value}ms`;      // Update the display text
    });

    slider.oninput = function() {       // Gets called when slider is moved
        sliderText.innerHTML = `Delay: ${slider.value}ms`;

        let filter = getComputedStyle(slider).getPropertyValue("--slider-filter");  // Pull the current filter from a css variable, looks like - "hue-rotate(0deg)"
        filter = filter.split("deg");
        filter[0] = filter[0].split("(");
        filter[0][1] = (parseInt(filter[0][1]) + 4).toString();     // Increase the number by 4
        filter[0] = filter[0].join("(");
        filter = filter.join("deg");
        slider.style.setProperty("--slider-filter", filter);    // Update the variable

        chrome.storage.local.set({"delay": sliderText.innerHTML.split("ms").join("").split(" ")[1]});   // Update the localstorage setting
    }
})(document.getElementById("delay"), document.getElementById("delayVal"));