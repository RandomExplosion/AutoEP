window.addEventListener('load', function() {        // Runs when the tab is opened (when the html loads)
    chrome.storage.local.get(['mode', 'accuracy', 'accuracy_assist'], function(data) {     // Retrive the stored data for the settings from chrome's local storage
        console.log("Current mode retrieved as " + data.mode);
        mode = data.mode
        
        console.log("Accuracy retrieved as " + data.accuracy + "%");
        accuracy = parseInt(data.accuracy)

        console.log("Assist match level retrieved as " + data.accuracy_assist + "%");
        accuracy_assist = parseInt(data.accuracy_assist)
    });

    new Promise(resolve => setTimeout(resolve, 100)).then(() => {        // Give it time to retrive the data
        if (mode == "default") {
            document.getElementById("mode_assist").checked = false;     // Chrck and uncheck the checkboxes so they reflect the current settings
            document.getElementById("mode_default").checked = true;   
            document.getElementById("mode_hackerman").checked = false; 
        } else if (mode == "assist") {
            document.getElementById("mode_default").checked = false;
            document.getElementById("mode_assist").checked = true;
            document.getElementById("mode_hackerman").checked = false;
        } else if (mode == "hackerman") {
            document.getElementById("mode_default").checked = false;
            document.getElementById("mode_assist").checked = false;
            document.getElementById("mode_hackerman").checked = true;          
        }
        if (typeof accuracy != "number") {} else if (isNaN(accuracy)) {} else {     // Set the text in the input fields
            document.getElementById("accuracy").value = accuracy;
        }
        if (typeof accuracy_assist != "number") {} else if (isNaN(accuracy_assist)) {} else {
            document.querySelectorAll("input")[3].value = accuracy_assist;
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

var acc_assist_obj = document.querySelectorAll("input")[4]  // I know this method is a bit weird, but when i use the method used for the other input box it failes to find the input object
if (acc_assist_obj) {
    document.querySelectorAll("input")[4].onchange = function () {     // Same as above function but for the accuracy match level
        try {
            chrome.storage.local.remove("accuracy_assist");
        } catch (err) {
            console.log(err)
        }

        var accuracy_assist = document.querySelectorAll("input")[4].value;
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

document.getElementById("mode_hackerman").onchange = function () {
    chrome.storage.local.set({'mode': 'hackerman'}, function () {
        console.log("Mode saved as hackerman");
        console.log(" __  __                   __                                                    \r\n\/\\ \\\/\\ \\                 \/\\ \\                                                   \r\n\\ \\ \\_\\ \\     __      ___\\ \\ \\\/\'\\      __   _ __    ___ ___      __      ___    \r\n \\ \\  _  \\  \/\'__`\\   \/\'___\\ \\ , <    \/\'__`\\\/\\`\'__\\\/\' __` __`\\  \/\'__`\\  \/\' _ `\\  \r\n  \\ \\ \\ \\ \\\/\\ \\L\\.\\_\/\\ \\__\/\\ \\ \\\\`\\ \/\\  __\/\\ \\ \\\/ \/\\ \\\/\\ \\\/\\ \\\/\\ \\L\\.\\_\/\\ \\\/\\ \\ \r\n   \\ \\_\\ \\_\\ \\__\/.\\_\\ \\____\\\\ \\_\\ \\_\\ \\____\\\\ \\_\\ \\ \\_\\ \\_\\ \\_\\ \\__\/.\\_\\ \\_\\ \\_\\\r\n    \\\/_\/\\\/_\/\\\/__\/\\\/_\/\\\/____\/ \\\/_\/\\\/_\/\\\/____\/ \\\/_\/  \\\/_\/\\\/_\/\\\/_\/\\\/__\/\\\/_\/\\\/_\/\\\/_\/\r\n");
    });
}