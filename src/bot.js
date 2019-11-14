
var answer;  //The current answer
var mode;  //The current mode

chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.job === 'begin_task') {
        injectJS();     //Call the function to inject the js function to submit the answer
        
        mode = msg.mode;
        if (msg.mode == "assist") {
            accuracy = msg.accuracy;
            setInterval(checkAnswer, 200);
        }
    }
    else if (msg.job === 'answer') { //If script was just sent an answer
        if (mode == "default") {
            submit(msg.answer);
            if (msg.answer == "incorrect") {
                new Promise(resolve => setTimeout(resolve, 2000)).then(() => {  // Give the popup time to appear (sleep 2000ms)
                    document.getElementById("continue-button").click();     // Click the continue button
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


function injectJS() {       // Function to inject the js to submit js into the page
    console.log("Injecting js")
    // The following code first sets the value of the input field to equal the answer, it then tells the page to update the input. Then it presses the submit button.
    var code = `function submit(text) {
        $('input').val(text)
        $('input').change();
        angular.element('#submit-button').triggerHandler('click');
        angular.element('button.submit-button').triggerHandler('click');
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
    //Compare the user's answer to the correct answer
    var s1 = document.querySelectorAll("[id='answer-text']")[1].value;
    var s2 = answer;
    var match = 0;

    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        match = 100;
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
    if (match != 100) {
        match = (longerLength - costs[s2.length]) / parseFloat(longerLength) * 100;   
    }

    //console.log(`Checking answer: '${answer}' against '${document.querySelectorAll("[id='answer-text']")[1].value}'`)
    //console.log(`Match: ${match}%`)
    if (match >= accuracy) {
        submit(answer);
    }    
}






// Unused function 
function moreTime() {       // Function to click the more time button
    timer = document.getElementsByClassName("clock-label ep-animate ng-binding")[0].innerText; // Get the current amount of seconds left
    if (parseInt(timer, 10) < 5) {       // Check if there is less then 5 seconds left
        document.getElementsByClassName("more-time-button nice-button positive-green")[0].click();  // Click the more time button
    }
}