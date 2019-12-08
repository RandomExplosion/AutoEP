chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected message
    if (msg.job === "requesting_table") {
        let script = document.createElement('script');  //Create script tag on page so we can interface with the howler library
        script.textContent =  `(function() {
            Array.prototype.last = function() { return this[this.length - 1] };     //Function to return last element of array

            let audioInstances = {};
            Object.assign(audioInstances, Howler._howls)    //Find all active howler instances and clone them into a new dictionary

            Object.keys(audioInstances).forEach(function(key) {
                if (audioInstances[key]._src.startsWith("https://static.educationperfect.com/sound/")) {    //Make sure it is an mp3 for the translations
                    audioInstances[key] = audioInstances[key]._src.split("/").last().split(".")[0];     //Set each instance to just the mp3 name of the source file
                } else {
                    audioInstances[key] = undefined;        //Set it to undefined if it is not (delete is too slow)
                }
            })

            let response = document.createElement("div");   //Create an invisible div element
            response.id = "response";       //Set it's id to "response" so the content script can find it
            response.innerText = JSON.stringify(audioInstances);    //Set it's innerText to the mp3 names
            (document.head||document.documentElement).appendChild(response);    //Append the element to the document
        })()`;
        (document.head||document.documentElement).appendChild(script); 
        script.remove();  

        if (document.getElementById("response")) {       //Make sure the response element exists
            let audioNames = JSON.parse(document.getElementById("response").innerText);     //Pull the mp3 names from the response element
            let lannodes = document.querySelectorAll(".targetLanguage");    //Store the target language collumn as a nodelist
            let engnodes = document.querySelectorAll(".baseLanguage");  //Store the target language collumn as a nodelist
            let answerTable = Array(lannodes.length);   //Create Array to store string vocab
            for (let i = 0; i < answerTable.length; i++) { 
                answerTable[i] = new Array(3);
            }
            for (let i = 0; i < lannodes.length; i++) {
                answerTable[i][0] = lannodes[i].textContent;    //Copy the Target Translation for this prase to the first collumn of the array
                answerTable[i][1] = engnodes[i].textContent;    //Copy the Base Translation for this phrase to the second collumn of the array
                answerTable[i][2] = audioNames[i];              //Copy the mp3 name for this phrase to the third column of the array
            }   
            console.log(answerTable);
            sendResponse(answerTable);   //Send the nodelist back to the extention
            return true;    //Indicate call to SendResponse will be Asynchronous
        }
    }
});