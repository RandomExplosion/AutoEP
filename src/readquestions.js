//alert('Script Successfully Injected!');
var prevquestion; //The question that was displayed last time the script checked

//This is the script injected into the webpage read questions
chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.job === 'begin_task') {
        console.log('Beginning Task >:)'); //Log to console for debug purposes
        setInterval(copyandsend, msg.delay); //Begin Question Streaming Routine
    }
});

function copyandsend() {
    //Read the question displayed on screen
    var questiontext = document.getElementById('question-text').innerText;
    //If the question hasn't changed since the last time we checked 
    if (questiontext != prevquestion) {
        prevquestion = questiontext; //Update the previous question
        chrome.runtime.sendMessage({job: "answerQuestion", question: questiontext}); //Send it to the extension for processing
    }
}