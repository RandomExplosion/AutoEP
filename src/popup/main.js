
const sleep = (milliseconds) => {       //Function to pause script for an amount of milliseconds
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function load() {
    chrome.runtime.sendMessage({job: "load"});
    window.close();   
}

function start() {
    chrome.storage.local.get(['mode'], function(data) {
        console.log("Current mode retrieved as " + data.mode + "%");
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
        if (mode == "undefined") {
            mode = "default"
        }
        if (mode == "default") {
            if (typeof accuracy != "number") {
                alert("You have not selected the accuracy! Please visit the settings page")
            } else if (isNaN(accuracy)) {
                alert("You have not selected the accuracy! Please visit the settings page")
            } else {
                if (accuracy > 100) {
                    accuracy = 100
                } else if (accuracy < 0) {
                    accuracy = 0
                }
                chrome.runtime.sendMessage({job: "start", mode: "default", accuracy: accuracy});
                sleep(50).then(() => {
                    window.close();
                })
            }
    
        } else if (mode == "assist") {
            if (typeof accuracy_assist != "number") {
                alert("You have not selected the assist mode match level! Please visit the settings page")
            } else if (isNaN(accuracy_assist)) {
                alert("You have not selected the assist mode match level! Please visit the settings page")
            } else {
                if (accuracy > 100) {
                    accuracy = 100
                } else if (accuracy < 0) {
                    accuracy = 0
                }
                chrome.runtime.sendMessage({job: "start", mode: "assist", accuracy: accuracy_assist});
                sleep(50).then(() => {
                    window.close();
                })
            }
    
        } else {
            alert("You have not selected a mode! Please visit the settings page")
        }
    })
}


document.getElementById("load").addEventListener('click', function() {   //Event listener for when the 'load table' button is clicked
    load();
});

document.getElementById("start").addEventListener('click', function() {   //Event listener for when the 'start' button is clicked
    start();
});