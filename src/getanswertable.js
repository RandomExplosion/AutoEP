chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected message
    if (msg.job === "requesting_table") {
        let script = document.createElement('script');  //Create script tag on page so we can interface with the howler library
        script.textContent =  `(function() {
            let audioInstances = [];

            Object.keys(Howler._howls).forEach(key => {
                if (!Howler._howls[key]._src.startsWith("https://static.languageperfect.com/sound/dash") && !Howler._howls[key]._src.startsWith("static/sounds/")) {    //Make sure the mp3 isn't part of the dash sounds or the other static sounds
                    audioInstances.push(Howler._howls[key]._src.split("/").slice(-1)[0].split(".")[0]);  //Save just the name of the mp3
                }
            });

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

            // Re-enable the start button
            document.getElementById("start-button-main").disabled = false; 
            document.getElementById("start-button-main").style.background='#29b867';

            console.log(answerTable);
            sendResponse(answerTable);   //Send the nodelist back to the extention
            return true;    //Indicate call to SendResponse will be Asynchronous
        }
    }
});