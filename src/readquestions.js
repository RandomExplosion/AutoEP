var prevquestion; //The question that was displayed last time the script checked
var questiontext; //The current question

//This is the script injected into the webpage read questions
chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.job === 'begin_task') {
        console.log('Beginning Task >:)'); //Log to console for debug purposes

        let script = document.createElement('script'); 
        script.textContent =  `function readAudio() {

            var questiontext = undefined;

            Object.keys(Howler._howls).forEach(key => {
                if (!Howler._howls[key]._src.startsWith("https://static.languageperfect.com/sound/dash") && !Howler._howls[key]._src.startsWith("static/sounds/")) {    //Make sure the mp3 isn't part of the dash sounds or the other static sounds
                    if (!Howler._howls[key]._sounds[0]._paused) {
                        questiontext = Howler._howls[key]._src.split("/").slice(-1)[0].split(".")[0];   //Save just the name of the mp3
                    }
                }
            });

            //console.log(\`Detected mp3: $\{questiontext\}\`);

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
