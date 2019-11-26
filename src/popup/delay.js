
var slider = document.getElementById("delay");

window.addEventListener('load', function() {        // Runs when the tab is opened (when the html loads)
    chrome.storage.local.get(['delay'], function(data) {     // Retrive the stored data for the settings from chrome's local storage
        console.log("Delay retrieved as " + data.delay + "ms");
        delay = data.delay
    });
    new Promise(resolve => setTimeout(resolve, 100)).then(() => {        // Give it time to retrive the data
        slider.step = "25";
        if (delay != undefined) {
            slider.value = delay
        }
        else {
            slider.value = 300
        }
        document.getElementById("delayVal").innerHTML = `Delay: ${document.getElementById("delay").value}ms`
    });
})

// Update the current slider value (each time you drag the slider handle)
if (slider) {
    slider.oninput = function() {
        document.getElementById("delayVal").innerHTML = `Delay: ${this.value}ms`;
        try {
            chrome.storage.local.remove("delay");    // This will only have an error when the user is new to the program because the key won't exist in the user's localstorage
        } catch (err) {
            console.log(err)
        }

        
        var filter = getComputedStyle(document.getElementById("delay")).getPropertyValue('--slider-filter');
        filter = filter.split("deg");
        filter[0] = filter[0].split("(");
        filter[0][1] = (parseInt(filter[0][1]) + 4).toString();

        filter[0] = filter[0].join("(");
        filter = filter.join("deg");

        document.getElementById("delay").style.setProperty('--slider-filter', filter);

        var delay = document.getElementById("delayVal").innerHTML.split("ms").join("").split(" ")[1];   // Pull the current text from the input field and format it so it is just the number without the other text (it’s janky but it works)
        chrome.storage.local.set({'delay': delay}, function () {      // Save the new delay
            console.log("Delay saved as " + delay + "ms")
        });
    }
}




var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");
if (rangeSlider) {
    rangeSlider.addEventListener("input", showSliderValue, false);
}
function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = (rangeSlider.value /rangeSlider.max);
  rangeBullet.style.left = (bulletPosition * 578) + "px";
}
