function load() {
    chrome.runtime.sendMessage({job: "load"});
    window.close();
}

function start() {
    var accuracy = document.getElementById("accuracy").value    //Get accuracy value
    if (accuracy == "" || accuracy > 100) {   //If it is blank or over 100, default it to 90%
        accuracy = 90 
    }
    if (accuracy < 0) {     //If it is below zero, set it to 0%
        accuracy = 0
    }
    chrome.runtime.sendMessage({job: "start", accuracy: accuracy});
    window.close();
}

document.getElementById("load").addEventListener('click', function() {   //Event listener for when the 'load table' button is clicked
    load();
});

document.getElementById("start").addEventListener('click', function() {   //Event listener for when the 'start' button is clicked
    start();
});

window.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) { //If the user presses enter, Start reading automatically
      start();
    }
  });