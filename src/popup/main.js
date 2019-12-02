(function() {
    chrome.runtime.sendMessage({job: "update_buttons"});

    chrome.runtime.onMessage.addListener(function (msg) {
        if (msg.job == "toggle_buttons") {
            document.getElementById("load").disabled = true;     
            document.getElementById("start").disabled = true; 

            if (msg.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/game.*mode=[0123]/g) || msg.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/dash.*mode=[0123]/g)) {  
                document.getElementById("start").disabled = false;
            }
            else if (msg.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*list-starter.*/g)) {      
                document.getElementById("load").disabled = false;
            }
        }
    })

    document.getElementById("load").addEventListener('click', function() {  
        chrome.runtime.sendMessage({job: "load"});
        window.close();  
    });

    document.getElementById("start").addEventListener('click', function() {   
        chrome.storage.local.get(['mode', 'delay', 'accuracy', 'accuracy_assist'], function(data) {     // Retrive the data for the settings from chrome's local storage
            let mode = data.mode
            let delay = data.delay
            let accuracy = parseInt(data.accuracy)
            let accuracy_assist = parseInt(data.accuracy_assist)
    
            switch (mode) {
                case "default": {
                    if (typeof accuracy != "number" || isNaN(accuracy)) {
                        alert("You have not set the accuracy! Please visit the settings page");
                    } else {
                        if (accuracy > 100) {
                            accuracy = 100;
                        } else if (accuracy < 0) {
                            accuracy = 0;
                        }
                        chrome.runtime.sendMessage({job: "start", delay: delay, mode: "default", accuracy: accuracy});
                        window.close();  
                    }
                    break;
                }

                case "assist": {
                    if (typeof accuracy_assist != "number" || isNaN(accuracy_assist)) {
                        alert("You have not set the assist mode match level! Please visit the settings page");
                    } else {
                        if (accuracy_assist > 100) {
                            accuracy_assist = 100;
                        } else if (accuracy_assist < 0) {
                            accuracy_assist = 0;
                        }
                        chrome.runtime.sendMessage({job: "start", delay: delay, mode: "assist", accuracy: accuracy_assist});
                        window.close();  
                    }
                    break;
                }

                case "hackerman": {
                    chrome.runtime.sendMessage({job: "start", delay: delay, mode: "hackerman", accuracy: 100});
                    window.close();  
                    break;
                }

                default: {
                    alert("You have not set a mode! Please visit the settings page");                        
                }
            }
        });
    });
})();