//alert('Script Successfully Injected!');
var prevquestion; //The question that was displayed last time the script checked
var answer;  //The current answer
var mode;  //The current mode

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//This is the script injected into the webpage read questions
chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.job === 'begin_task') {
        console.log('Beginning Task >:)'); //Log to console for debug purposes
        injectJS();     //Call the function to inject the js function to submit the answer
        setInterval(copyandsend, 300); //Begin Question Streaming Routine
        
        mode = msg.mode;
        if (msg.mode == "assist") {
            accuracy = msg.accuracy;
            setInterval(checkAnswer, 200);
        }
    }
    else if (msg.job === 'copy') { //If script was just sent an answer
        if (mode == "default") {
            submit(msg.answer);
            if (msg.answer == "incorrect") {
                sleep(2000).then(() => {    // Give the popup time to appear
                    document.getElementById("continue-button").click(); // Click the continue button
                });
            }
        }
        else if (mode == "assist") {
            answer = msg.answer
        }

        if (msg.answer == null) {       //This means the table wasn't loaded correctly
            window.history.back();  // Return the user to the dashboard
            alert("Something went wrong and the answer table was loaded incorrectly... You have been ejected from the game."); 
        }
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

function injectJS() {       // Function to inject the js to submit js into the page
    console.log("Injecting js")
    //document.querySelectorAll("[id='answer-text']")[1].value; <- get the text in the input field

    // The following code first sets the value of the input field to equal the answer, it then tells the page to update the input. Then it presses the submit button.
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

function checkAnswer() {
    var s1 = document.querySelectorAll("[id='answer-text']")[1].value;
    var s2 = answer;
    var level = 0;

    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      level = 100;
    }

    s1 = longer.toLowerCase();
    s2 = shorter.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    if (level != 100) {
        level = (longerLength - costs[s2.length]) / parseFloat(longerLength) * 100;   
    }

    //console.log(`Checking answer: ${answer}`)
    //sconsole.log(`Level: ${level}%`)
    if (level > accuracy) {
        submit(answer);
        sleep(200).then(() => {
            document.querySelectorAll("[id='answer-text']")[1].value = "";
        });
    }    
}






// Unused function
function moreTime() {
    timer = document.getElementsByClassName("clock-label ep-animate ng-binding")[0].innerText; // Get the current amount of seconds left
    if (parseInt(timer, 10) < 5) {       // Check if there is less then 5 seconds left
        document.getElementsByClassName("more-time-button nice-button positive-green")[0].click();  // Click the more time button
    }
}