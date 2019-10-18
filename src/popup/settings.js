
const sleep = (milliseconds) => {       //Function to pause script for an amount of milliseconds
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

window.addEventListener('load', function() {        // Runs when the tab is opened (when the html loads)
    chrome.storage.local.get(['mode'], function(data) {     // Retrive the stored data for the settings from chrome's local storage
        console.log("Current mode retrieved as " + data.mode);
        mode = data.mode
    });
    chrome.storage.local.get(['accuracy'], function(data) {
        console.log("Accuracy retrieved as " + data.accuracy + "%");
        accuracy = parseInt(data.accuracy)
    });
    chrome.storage.local.get(['accuracy_assist'], function(data) {
        console.log("Assist match level retrieved as " + data.accuracy_assist + "%");
        accuracy_assist = parseInt(data.accuracy_assist)
    });
    chrome.storage.local.get(['theme'], function(data) {
        console.log("Theme retrieved as " + data.theme);
        theme = data.theme
    });

    sleep(100).then(() => {        // Give it time to retrive the data
        if (theme != "dark" && theme != "light") {      // Check for the current theme
            theme = "dark"
        }
        if (theme == "dark") {     
            document.getElementById("theme").href = "style_dark.css"    // Update the page css
        } else if (theme == "light") {
            document.getElementById("theme").href = "style_light_css"
        }

        if (mode == "default") {
            document.getElementById("mode_assist").checked = false;     // Chrck and uncheck the checkboxes so they reflect the current settings
            document.getElementById("mode_default").checked = true;    
        } else if (mode == "assist") {
            document.getElementById("mode_default").checked = false;
            document.getElementById("mode_assist").checked = true;
        }
        if (typeof accuracy != "number") {} else if (isNaN(accuracy)) {} else {     // Set the text in the input fields
            document.getElementById("accuracy").value = accuracy;
        }
        if (typeof accuracy_assist != "number") {} else if (isNaN(accuracy_assist)) {} else {
            document.getElementById("accuracy_assist").value = accuracy_assist;
        }
    })
})

var acc_obj = document.getElementById("accuracy");
if (acc_obj) {
    document.getElementById("accuracy").onchange = function () {        // Event listener for the change of the input field for accuracy, this updates when the user clicks off the box after enting text
        try {
            chrome.storage.local.remove("accuracy");    // This will only have an error when the user is new to the program because the key won't exist in the user's localstorage
        } catch (err) {
            console.log(err)
        }

        var accuracy = document.getElementById("accuracy").value;   // Pull the current text from the input field
        chrome.storage.local.set({'accuracy': accuracy}, function () {      // Save the new accuracy
            console.log("Accuracy saved as " + accuracy + "%")
        });
    }
}

var acc_assist_obj = document.getElementById("accuracy_assist");        // This cant find the object for some reason - TODO: THIS DOES NOT WORK
if (acc_assist_obj) {
    document.getElementById("accuracy_assist").onchange = function () {     // Same as above function but for the accuracy match level
        try {
            chrome.storage.local.remove("accuracy_assist");
        } catch (err) {
            console.log(err)
        }

        var accuracy_assist = document.getElementById("accuracy_assist").value;
        chrome.storage.local.set({'accuracy_assist': accuracy_assist}, function () {
            console.log("Assist match level saved as " + accuracy_assist + "%")
        });
    }
}

document.getElementById("mode_default").onchange = function () {        // Update the saved mode when the checkboxes are modified
    chrome.storage.local.set({'mode': "default"}, function () {
        console.log("Mode saved as default");
    });
}

document.getElementById("mode_assist").onchange = function () {
    chrome.storage.local.set({'mode': "assist"}, function () {
        console.log("Mode saved as assist");
    });
}

