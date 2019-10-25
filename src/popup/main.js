
const sleep = (milliseconds) => {       // Function to pause script for an amount of milliseconds
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

window.addEventListener('load', function() {        // Runs when the tab is opened (when the html loads)
    chrome.storage.local.get(['theme'], function(data) {
        console.log("Theme retrieved as " + data.theme);
        theme = data.theme
    });
    chrome.runtime.sendMessage({job: "update_buttons"});
    sleep(100).then(() => {        // Give it time to retrive the data
        if (theme != "dark" && theme != "light") {
            theme = "dark"
        }
        if (theme == "dark") {     
            document.getElementById("theme").href = "style_dark.css"    // Update the page css
        } else if (theme == "light") {
            document.getElementById("theme").href = "style_light.css"
        }
    })
})

chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.job == "toggle_buttons") {
        if (msg.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/game.*mode=[0123]/g)) {  
            document.getElementById("start").disabled = false;
            document.getElementById("load").disabled = true;
        }
        else if (msg.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*list-starter.*/g)) {      
            document.getElementById("load").disabled = false;
            document.getElementById("start").disabled = true;
        }
        else {
            document.getElementById("load").disabled = true;     
            document.getElementById("start").disabled = true;      
        }
    }
})

function load() {
    chrome.runtime.sendMessage({job: "load"});
    window.close();   
}

function start() {
    chrome.storage.local.get(['mode', 'accuracy', 'accuracy_assist'], function(data) {     // Retrive the data for the settings from chrome's local storage
        console.log("Current mode retrieved as " + data.mode + "%");
        mode = data.mode
        
        console.log("Accuracy retrieved as " + data.accuracy + "%");
        accuracy = parseInt(data.accuracy)

        console.log("Assist match level retrieved as " + data.accuracy_assist + "%");
        accuracy_assist = parseInt(data.accuracy_assist)
    });

    sleep(100).then(() => {        // Give it time to retrive the data
        if (mode != "default" && mode != "assist") {        // If a mode has not been set, default to default mode
            mode = "default"
        }
        if (mode == "default") {
            if (typeof accuracy != "number") {      // Make sure the accuracy value is a correct number
                alert("You have not set the accuracy! Please visit the settings page")
            } else if (isNaN(accuracy)) {
                alert("You have not set the accuracy! Please visit the settings page")
            } else {
                if (accuracy > 100) {       // If it is a number but out of the range round it
                    accuracy = 100
                } else if (accuracy < 0) {
                    accuracy = 0
                }
                chrome.runtime.sendMessage({job: "start", mode: "default", accuracy: accuracy});
                sleep(50).then(() => {      // Wait 50ms for the message to send properly before terminating the window and thus, this script
                    window.close();
                })
            }
    
        } else if (mode == "assist") {
            if (typeof accuracy_assist != "number") {
                alert("You have set the assist mode match level! Please visit the settings page")
            } else if (isNaN(accuracy_assist)) {
                alert("You have set the assist mode match level! Please visit the settings page")
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
        }
    })
}


document.getElementById("load").addEventListener('click', function() {   //Event listener for when the 'load table' button is clicked
    load();
});

document.getElementById("start").addEventListener('click', function() {   //Event listener for when the 'start' button is clicked
    start();
});