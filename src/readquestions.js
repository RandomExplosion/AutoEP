var prevquestion; //The question that was displayed last time the script checked
var questiontext; //The current question

//This is the script injected into the webpage read questions
chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.job === 'begin_task') {
        console.log('Beginning Task >:)'); //Log to console for debug purposes

        let script = document.createElement('script'); 
        script.textContent =  `function readAudio() {
            var questiontext;
            var audioInstances = {};
            Object.assign(audioInstances, Howler._howls)

            Object.keys(audioInstances).forEach(function(key) {
                if (audioInstances[key]._src.startsWith("https://static.educationperfect.com/sound/")) {    //Make sure it is an mp3 for the translations
                    audioInstances[key] = [audioInstances[key]._src.split("/").last().split(".")[0], audioInstances[key].playing()];     //Set each instance to just the mp3 name of the source file and if it is playing
                    if (audioInstances[key][1]) {
                        questiontext = audioInstances[key][0];
                    }
                } else {
                    audioInstances[key] = undefined;        //Set it to undefined if it is not (delete is too slow)
                }
            })


            //console.log(\`Sending: $\{questiontext\}\`);

            window.postMessage({ type: 'questionResponse', questiontext: questiontext}, '*');
        }`; 
        (document.head||document.documentElement).appendChild(script); 
        script.remove();  

        //Play the first audio click manually because it does not start by itself   ( if the element exists )
        if (document.getElementsByClassName("voice-speaker bg-audio-speaker-on")[0]) {  
            document.getElementsByClassName("voice-speaker bg-audio-speaker-on")[0].click()
        }

        setInterval(copyandsend, msg.delay);    //Begin Question Streaming Routine and assign handler to variable
    }
});

function copyandsend() {
    //Read the question displayed on screen
    questiontext = document.getElementById('question-text').innerText;
    //console.log(questiontext);

    if (questiontext == "") {
        var script = document.createElement('script'); 
        script.textContent = `readAudio()`; 
        (document.head||document.documentElement).appendChild(script); 
        script.remove(); 
    } else {
        //If the question hasn't changed since the last time we checked 
        if (questiontext != prevquestion && questiontext != undefined) {
            prevquestion = questiontext; //Update the previous question
            chrome.runtime.sendMessage({job: "answerQuestion", question: questiontext}); //Send it to the extension for processing
        }
    }
}

window.addEventListener('message', function(event) {    //Listen for a message from the window
    if (event.data.type == "questionResponse") {
        questiontext = event.data.questiontext;
        if (questiontext != prevquestion && questiontext != undefined) {
            prevquestion = questiontext; //Update the previous question
            chrome.runtime.sendMessage({job: "answerQuestion", question: questiontext}); //Send it to the extension for processing
        }      
    }
});
