//This is the script injected into the webpage to answer questions
chrome.runtime.onMessage.addListener(function (msg, VocabDict) {
    if (msg.text === "begin_task")
    {
        console.log("Beginning Task >:)"); //Log to console for debug purposes

        while (true)
        {
            let questiontext = document.querySelector("question-text"); //Read the question displayed on screen
            VocabDict.get(questiontext); //Check the question against the dictionary
        }

    }
});