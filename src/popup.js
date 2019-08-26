document.getElementById("load").addEventListener('click', function() {   //Event listener for when the 'load table' button is clicked
    chrome.runtime.sendMessage({job: "load"});
    window.close();
});

document.getElementById("start").addEventListener('click', function() {   //Event listener for when the 'start' button is clicked
    var accuracy = document.getElementById("accuracy").value    //Get accuracy value
    if (accuracy == "" || accuracy > 100) {   //If it is blank or over 100, default it to 100%
        accuracy = 100 
    }
    if (accuracy < 0) {     //If it is below zero, set it to 0%
        accuracy = 0
    }
    chrome.runtime.sendMessage({job: "start", accuracy: accuracy});
    window.close();
});
