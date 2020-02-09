// Update the buttons
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    let url = tabs[0].url;
    document.getElementById('load').disabled = true;     // Disable both buttons, they will be re-enabled depending on the current page
    document.getElementById('start').disabled = true; 

    if (url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/game.*mode=[01238]/g) || url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/dash.*mode=[01238]/g)) {  
        document.getElementById('start').disabled = false;
    }

    if (url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*list-starter.*/g)) {      
        document.getElementById('load').disabled = false;
    }
});

document.getElementById('load').onclick = () => {
    chrome.runtime.sendMessage({job: 'load'});
    window.close();  
};  

document.getElementById('start').onclick = () => {
    chrome.storage.local.get(['mode', 'delay', 'accuracy', 'accuracy_assist'], data => {     // Retrive the data for the settings from chrome's local storage
        let mode = data.mode;
        let delay = data.delay;
        let accuracy = parseInt(data.accuracy);
        let accuracy_assist = parseInt(data.accuracy_assist);

        switch (mode) {
            case 'default': {
                if (isNaN(accuracy)) {      // Make sure the accuracy value is a number
                    alert('You have not set the accuracy! Please visit the settings page');
                } else {
                    accuracy = accuracy > 100 ? 100 : accuracy < 0 ? 0 : accuracy;      // Round accuracy to be between 0-100
                }
                chrome.runtime.sendMessage({job: 'start', delay: delay, mode: 'default', accuracy: accuracy});
                window.close(); 
                break;
            }

            case 'assist': {
                if (isNaN(accuracy_assist)) {      // Make sure the accuracy value is a number
                    alert('You have not set the assist mode match level! Please visit the settings page');
                } else {
                    accuracy_assist = accuracy_assist > 100 ? 100 : accuracy_assist < 0 ? 0 : accuracy_assist;      // Round accuracy_assist to be between 0-100
                }
                chrome.runtime.sendMessage({job: 'start', delay: delay, mode: 'assist', accuracy: accuracy_assist});
                window.close(); 
                break;
            }

            case 'hackerman': {
                chrome.runtime.sendMessage({job: 'start', delay: delay, mode: 'hackerman', accuracy: 100});
                window.close(); 
                break;
            }

            default: {
                alert("You have not set a mode! Please visit the settings page");                        
            }
        }
    });
};