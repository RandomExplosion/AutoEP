alert('Script Successfully Injected!');
alert('Opening Communications Port');
let ansport = chrome.runtime.connect({name: "questionport"});

//This is the script injected into the webpage read questions
ansport.onMessage.addListener(function (msg) {
    if (msg.text === 'begin_task')
    {
        alert('Beginning Task >:)'); //Log to console for debug purposes
        setInterval(copyandsend, 1000); //Begin Question Streaming Routine
    }
});

function copyandsend() 
{
    alert("sending question");
    //Get question from webpage
    let questiontext = document.getElementById('question-text').innerText; //Read the question displayed on screen
    //Send back to the extention
    ansport.postMessage({question: questiontext});
}