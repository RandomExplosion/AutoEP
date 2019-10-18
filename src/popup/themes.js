
const sleep = (milliseconds) => {       //Function to pause script for an amount of milliseconds
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

window.addEventListener('load', function() {        // Runs when the tab is opened (when the html loads)
    chrome.storage.local.get(['theme'], function(data) {
        console.log("Theme retrieved as " + data.theme);
        theme = data.theme
    });

    sleep(100).then(() => {        // Give it time to retrive the data
        if (theme != "dark" && theme != "light") {
            theme = "dark"
        }
        if (theme == "dark") {     
            document.getElementById("theme").href = "style_dark.css"    // Update the page css
            document.getElementById("light").checked = false;     // Chrck and uncheck the checkboxes so they reflect the current settings
            document.getElementById("dark").checked = true;    
        } else if (theme == "light") {
            document.getElementById("theme").href = "style_light_css"
            document.getElementById("dark").checked = false;
            document.getElementById("light").checked = true;
        }
    })
})

document.getElementById("dark").onchange = function () {        // Update the saved mode when the checkboxes are modified
    chrome.storage.local.set({'theme': "dark"}, function () {
        document.getElementById("theme").href = "style_dark.css"
        console.log("Theme saved as dark");
    });
}

document.getElementById("light").onchange = function () {        // Update the saved mode when the checkboxes are modified
    chrome.storage.local.set({'theme': "light"}, function () {
        document.getElementById("theme").href = "style_light_css"
        console.log("Theme saved as light");
    });
}