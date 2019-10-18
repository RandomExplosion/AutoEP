
const sleep = (milliseconds) => {       //Function to pause script for an amount of milliseconds
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

window.addEventListener('load', function() {
    chrome.storage.local.get(['mode'], function(data) {
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

    sleep(100).then(() => { // Give it time to retrive the data
        if (mode == "default") {
            document.getElementById("mode_assist").checked = false;
            document.getElementById("mode_default").checked = true;    
        } else if (mode == "assist") {
            document.getElementById("mode_default").checked = false;
            document.getElementById("mode_assist").checked = true;
        }
        if (typeof accuracy != "number") {} else if (isNaN(accuracy)) {} else {
            document.getElementById("accuracy").value = accuracy;
        }
        if (typeof accuracy_assist != "number") {} else if (isNaN(accuracy_assist)) {} else {
            document.getElementById("accuracy_assist").value = accuracy_assist;
        }
    })
})

var acc_obj = document.getElementById("accuracy");
if (acc_obj) {
    document.getElementById("accuracy").onchange = function () {
        try {
            chrome.storage.local.remove("accuracy");
        } catch (err) {
            console.log(err)
        }

        var accuracy = document.getElementById("accuracy").value;
        chrome.storage.local.set({'accuracy': accuracy}, function () {
            console.log("Accuracy saved as " + accuracy + "%")
        });
    }
}

var acc_assist_obj = document.getElementById("accuracy_assist"); //This cant find the object for some reason
if (acc_assist_obj) {
    document.getElementById("accuracy_assist").onchange = function () {
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

document.getElementById("mode_default").onchange = function () {
    chrome.storage.local.set({'mode': "default"}, function () {
        console.log("Mode saved as default");
    });
}

document.getElementById("mode_assist").onchange = function () {
    chrome.storage.local.set({'mode': "assist"}, function () {
        console.log("Mode saved as assist");
    });
}

