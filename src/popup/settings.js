chrome.storage.local.get(['mode', 'accuracy', 'accuracy_assist'], function(data) {     // Retrive the stored data for the settings from chrome's local storage
    let accuracy = parseInt(data.accuracy);
    let accuracy_assist = parseInt(data.accuracy_assist);

    document.querySelectorAll('[id^=mode_]').forEach(element => { 
        element.checked = false;   // Uncheck each checkbox
        element.onchange = () => { chrome.storage.local.set({'mode': `${element.id.split('_')[1]}`}) };     // Set onchange to update the localstorage mode  
    });  
    document.getElementById(`mode_${data.mode}`).checked = true;

    if (!isNaN(accuracy)) {     // Set the text in the input fields
        document.getElementById('accuracy').value = accuracy;
    }
    
    if (!isNaN(accuracy_assist)) {
        document.getElementById('acc_assist').value = accuracy_assist;
    }
});

document.getElementById('accuracy').onchange = () => {     
    chrome.storage.local.set({'accuracy': document.getElementById("accuracy").value});
};

document.getElementById('acc_assist').onchange = () => {    
    chrome.storage.local.set({'accuracy_assist': document.getElementById('acc_assist').value});
};