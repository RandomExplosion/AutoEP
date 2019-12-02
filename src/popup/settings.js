(function() {
    chrome.storage.local.get(['mode', 'accuracy', 'accuracy_assist'], function(data) {     // Retrive the stored data for the settings from chrome's local storage
        let mode = data.mode;
        let accuracy = parseInt(data.accuracy);
        let accuracy_assist = parseInt(data.accuracy_assist);

        document.querySelectorAll('[id^=mode_]').forEach(function(element) { element.checked = false; });
        document.getElementById(`mode_${mode}`).checked = true;

        if (typeof accuracy == "number" && !isNaN(accuracy)) {     // Set the text in the input fields
            document.getElementById("accuracy").value = accuracy;
        }
        if (typeof accuracy_assist == "number" && !isNaN(accuracy_assist)) {
            document.querySelectorAll("input")[4].value = accuracy_assist;
        }
    });

    document.getElementById("accuracy").onchange = function () {     
        chrome.storage.local.set({'accuracy': document.getElementById("accuracy").value});
    }

    document.querySelectorAll("input")[4].onchange = function () {    
        chrome.storage.local.set({'accuracy_assist': document.querySelectorAll("input")[4].value});
    }   

    document.getElementById("mode_default").onchange = function () {     
        chrome.storage.local.set({'mode': "default"});
    }     

    document.getElementById("mode_assist").onchange = function () {
        chrome.storage.local.set({'mode': "assist"});
    }

    document.getElementById("mode_hackerman").onchange = function () {
        chrome.storage.local.set({'mode': 'hackerman'}, function () {
            console.log("Mode saved as");
            console.log(" __  __                   __                                                    \r\n\/\\ \\\/\\ \\                 \/\\ \\                                                   \r\n\\ \\ \\_\\ \\     __      ___\\ \\ \\\/\'\\      __   _ __    ___ ___      __      ___    \r\n \\ \\  _  \\  \/\'__`\\   \/\'___\\ \\ , <    \/\'__`\\\/\\`\'__\\\/\' __` __`\\  \/\'__`\\  \/\' _ `\\  \r\n  \\ \\ \\ \\ \\\/\\ \\L\\.\\_\/\\ \\__\/\\ \\ \\\\`\\ \/\\  __\/\\ \\ \\\/ \/\\ \\\/\\ \\\/\\ \\\/\\ \\L\\.\\_\/\\ \\\/\\ \\ \r\n   \\ \\_\\ \\_\\ \\__\/.\\_\\ \\____\\\\ \\_\\ \\_\\ \\____\\\\ \\_\\ \\ \\_\\ \\_\\ \\_\\ \\__\/.\\_\\ \\_\\ \\_\\\r\n    \\\/_\/\\\/_\/\\\/__\/\\\/_\/\\\/____\/ \\\/_\/\\\/_\/\\\/____\/ \\\/_\/  \\\/_\/\\\/_\/\\\/_\/\\\/__\/\\\/_\/\\\/_\/\\\/_\/\r\n");
        });
    }
})();