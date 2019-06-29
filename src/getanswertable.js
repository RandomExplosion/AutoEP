alert("Script Successfully Injected >:)")

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected message
    switch (msg.text)
    {
        case "requesting_lan":
            //alert("Recieved Request For Language Nodes");
            let lannodes = document.querySelectorAll(".targetLanguage"); //Store the target language collumn as a nodelist
            //alert("PrePassLAN: " + lantable); //Display the nodelist on screen
            let lanstrings = Array(lannodes.length);
            for(i = 0; i<lannodes.length; i++)
            {
                lanstrings[i] = lannodes[i].textContent;
            }
            sendResponse(langstrings); //Send the nodelist back to the extention
        break;

        case "requesting_eng":
            //alert("Recieved Request For English Nodes");
            let engnodes = document.querySelectorAll(".baseLanguage"); //Store the target language collumn as a nodelist
            //alert("PrePassENG: " + engnodes); //Display the nodelist on screen
            let engstrings = Array(engnodes.length);
            for(i = 0; i<engnodes.length; i++)
            {
                engstrings[i] = engnodes[i].textContent;
            }
            sendResponse(engstrings); //Send the nodelist back to the extention
        break;
    }
        
        
});