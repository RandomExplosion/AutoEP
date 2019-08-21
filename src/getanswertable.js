alert("Script Successfully Injected >:)")


// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected message
    if (msg.job === "requesting_table") {
        //alert("Recieved Table Request");
        let lannodes = document.querySelectorAll(".targetLanguage"); //Store the target language collumn as a nodelist
        let engnodes = document.querySelectorAll(".baseLanguage"); //Store the target language collumn as a nodelist
        //alert("PrePassLAN: " + lantable); //Display the nodelist on screen
        let strtable = Array(lannodes.length); //Create Array to store string vocab
        for (let i = 0; i<strtable.length; i++) //Make Array 2d (add space for base translation)
            strtable[i] = new Array(2);

        for(let i = 0; i<lannodes.length; i++)
        {
            //Copy the Target Translation for this prase to the first collumn of the array
            strtable[i][0] = lannodes[i].textContent; 
            //Copy the Base Translation for this phrase to the second to the second collumn of the array
            strtable[i][1] = engnodes[i].textContent; 
        }
        console.log(strtable);
        sendResponse(strtable); //Send the nodelist back to the extention
        return true; //Indicate call to SendResponse will be Asynchronous
    }
   
});