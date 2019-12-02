(function() {             // This is so it doesn't get interfered with by the page content
    var mode;       //Store current mode  
    var accuracy;   //Store current accuracy
    var answer;     //Store current answer

    chrome.runtime.onMessage.addListener(function (msg) {
        if (msg.job == "begin_task") {            
            mode = msg.mode
            accuracy = msg.accuracy

            // If beginning task inject javascript code to answer questions
            injectJS();

            if (msg.mode == "assist") {
                setInterval(checkAnswer, 200);  // In assist mode check the user's answer every 200ms
            } else if (msg.mode == "hackerman") {
                setInterval((function() {       // Every 4ms check the user's answer and update the input field
                    let answer_text = answer.slice(0, document.querySelectorAll("[id='answer-text']")[1].value.length);
                    let script = document.createElement('script');      // Create a script tag on the page
                    script.textContent = `$('input').val("${answer_text}"); $('input').change();`;      // Add the code into the script tag
                    (document.head||document.documentElement).appendChild(script);  // Add the script to the document
                    script.remove();  
                    if (answer_text == answer) {
                        submit(answer);
                    }
                }), 4)
            }
        } else if (msg.job == "answer") {
            if (msg.answer == null) {       // This means the table wasn't loaded correctly
                window.history.back();  // Return the user to the dashboard
                alert("Something went wrong and the answer table was loaded incorrectly... You have been ejected from the game."); 
            } else {
                if (mode == "default") {
                    submit(msg.answer);
                    if (msg.answer == "incorrect") {
                        new Promise(resolve => setTimeout(resolve, 2000)).then(() => {  // Give the popup time to appear (sleep 2000ms)
                            document.getElementById("continue-button").click();     // Click the continue button
                        });
                    }
                } else if (mode == "assist" || mode == "hackerman") {
                    answer = msg.answer
                }
            }
        }
    })


    function injectJS() {       // Function to inject the js to submit answers into the page
        console.log("Injecting js");
        let script = document.createElement('script');      // Create a script tag on the page
        script.textContent = `function submit(answer) {
            $('input').val(answer);
            $('input').change();
            angular.element('#submit-button').triggerHandler('click');
            angular.element('button.submit-button').triggerHandler('click');
        }`;
        (document.head||document.documentElement).appendChild(script);  // Add the script to the document
        script.remove();  
    }

    function submit(answer) {
        // Inject a function call into the page to call the submit function that was injected earlier
        location.href = `javascript:submit("${answer}"); void 0`;
    }

    function checkAnswer() {
        //Compare the user's answer to the correct answer - try not to think about it too much
        let s1 = document.querySelectorAll("[id='answer-text']")[1].value;
        let s2 = answer;
        let match = 0;
    
        let longer = s1;
        let shorter = s2;
        if (s1.length < s2.length) {
          longer = s2;
          shorter = s1;
        }
        let longerLength = longer.length;
        if (longerLength == 0) {
            match = 100;
        }
    
        s1 = longer.toLowerCase();
        s2 = shorter.toLowerCase();
      
        let costs = new Array();
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
          for (let j = 0; j <= s2.length; j++) {
            if (i == 0)
              costs[j] = j;
            else {
              if (j > 0) {
                let newValue = costs[j - 1];
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
})();




/*
function moreTime() {       // Function to click the more time button
    timer = document.getElementsByClassName("clock-label ep-animate ng-binding")[0].innerText; // Get the current amount of seconds left
    if (parseInt(timer, 10) < 5) {       // Check if there is less then 5 seconds left
        document.getElementsByClassName("more-time-button nice-button positive-green")[0].click();  // Click the more time button
    }
}
*/