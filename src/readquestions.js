//alert('Script Successfully Injected!');
var prevquestion; //The question that was displayed last time the script checked

//This is the script injected into the webpage read questions
chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.job === 'begin_task') {
        console.log('Beginning Task >:)'); //Log to console for debug purposes
        injectJS();     //Call the function to inject the js function to submit the answer
        setInterval(copyandsend, 200); //Begin Question Streaming Routine
    }
    else if (msg.job === 'copy') { //If script was just sent an answer
        //navigator.clipboard.writeText(msg.answer);
        submit(msg.answer);
    }
});

function copyandsend() {
    //Read the question displayed on screen
    var questiontext = document.getElementById('question-text').innerText;
    //If the question hasn't changed since the last time we checked 
    if (questiontext != prevquestion) {
        prevquestion = questiontext; //Update the previous question
        chrome.runtime.sendMessage({question: questiontext}); //Send it to the extension for processing
    }
}

function moreTime() {       //Press the more time button
    document.getElementsByClassName("more-time-button nice-button positive-green")[0].click();
}

function injectJS() {       // Function to inject the js to submit js into the page
    console.log("Injecting js")
    //document.querySelectorAll("[id='answer-text']")[1] <- another method of getting input field
    var code = `function submit(text) {
        $('input').val(text)
        $('input').change();
        angular.element('#submit-button').triggerHandler('click');
    }`;
    var script = document.createElement('script');      // Create a script tag on the page
    script.textContent = code;      // Add the code into the script tag
    (document.head||document.documentElement).appendChild(script);  // Add the script to the document
    script.remove();  
}

function submit(text) {     // Submit text
    var code = `submit("${text}");`;    // Inject code to call the submit function (that was injected earlier)
    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
};