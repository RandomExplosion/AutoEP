alert("Script Successfully Injected >:)")

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected message
    if (msg.text === "requesting_table")
    {
        //alert("Recieved Table Request");
        let lannodes = document.querySelectorAll(".targetLanguage"); //Store the target language collumn as a nodelist
        let engnodes = document.querySelectorAll(".targetLanguage"); //Store the target language collumn as a nodelist
        //alert("PrePassLAN: " + lantable); //Display the nodelist on screen
        let strtable = Array(2, lannodes.length);
        for(i = 0; i<lannodes.length; i++)
        {
            //Copy the Target Translation for this prase to the first collumn of the array
            strtable[0, i] = lannodes[i].textContent; 
            //Copy the Base Translation for this phrase to the second to the second collumn of the array
            strtable[1, i] = engnodes[i].textContent; 
        }
        console.log(strtable);
        sendResponse(strtable); //Send the nodelist back to the extention
    }
});