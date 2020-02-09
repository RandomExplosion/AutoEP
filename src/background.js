//Array for the target language table
let lantoeng = new Map();   // TARGET to BASE
let engtolan = new Map();   // BASE to TARGET
let audtolan = new Map();   // AUDIO to TARGET
let audtoeng = new Map();   // AUDIO to BASE

//Stores The Current Gamemode
var gamemode; 

//Stores the current mode (default / assist / hackerman)
var mode;

//Stores the accuracy
var accuracy;

//Stores the delay
var delay;

chrome.runtime.onInstalled.addListener(details => {       // Runs when the extension is newly installed
    if (details.reason == "install") {
        chrome.storage.local.set({'delay': '300'});
        chrome.storage.local.set({'mode': 'default'});
        chrome.storage.local.set({'accuracy': ''});
        chrome.storage.local.set({'accuracy_assist': ''});
    } 
});

// Callback function for table data request
function StoreTableData(tabledata) {   
    if (tabledata != undefined) {
        console.log('Recieved Table Data!');
        console.log('Creating Dictionaries');

        for (let i = 0; i < tabledata.length; i++) { //For every phrase (both languages)
            //First remove anything in brackets, then any leftover punctuation
            lantoeng.set(tabledata[i][0].replace(/ *\([^)]*\) */g, "").replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""), tabledata[i][1].replace(/;/g, ",")); //Add it to the Target Language - Base Language Dictionary
            engtolan.set(tabledata[i][1].replace(/ *\([^)]*\) */g, "").replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""), tabledata[i][0].replace(/;/g, ",")); //Add it to the Base Language - Target Language Dictionary
            audtolan.set(tabledata[i][2], tabledata[i][0].replace(/;/g, ",")); //Add it to the Audio - Target Language Dictionary
            audtoeng.set(tabledata[i][2], tabledata[i][1].replace(/;/g, ",")); //Add it to the Audio - Base Language Dictionary
        }   
        console.log(lantoeng);
        console.log(engtolan);
        console.log(audtolan);
        console.log(audtoeng);
    } 
    else {   
        console.log('Table is Empty!?');
    }
}   

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        //If the current webpage is a vocabulary list
        if (tab.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*list-starter.*/g)) {
            console.log('Injecting Script to Read Table');

            chrome.tabs.executeScript(tabId, {
                file: 'getanswertable.js'
            });
        }
        
        //If the current webpage is a game                                                                                  
        else if (tab.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/game.*mode=[0123]/g) || tab.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/dash.*mode=[0123]/g)) {
            console.log('Injecting Script to Play Game >:)');
            
            chrome.tabs.executeScript(tabId, {
                file: 'readquestions.js'
            });
            chrome.tabs.executeScript(tabId, {
                file: 'bot.js'
            });
        }

        //If current webpage is the test completed page
        else if (tab.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*\/test-statistics/g)) {
            console.log('Game Finished!');

            if (typeof gamemode != "undefined") {
                //TODO remove content scripts
                chrome.tabs.executeScript(tab.id, { 
                    code: `if (typeof speakingAnswerer != "undefined") { clearInterval(speakingAnswerer) }`
                });     //Delete the handler used to answer speaking mode if it exists

                gamemode = undefined;
            }
        }
    }
});

function load() {
    chrome.tabs.query({"currentWindow": true, "active": true}, function(tab) {    //Run a query for the active tab info
        console.log("Loading table...");
        var tab = tab[0];
        if (tab.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*list-starter.*/g)) {      
            //Log to the console for Debugging Purposes
            console.log('Requesting Table content...');  

            //Request Table Data
            chrome.tabs.sendMessage(tab.id, {job: 'requesting_table'}, StoreTableData);
        }
    });
}

function start() {
    chrome.tabs.query({"currentWindow": true, "active": true}, function(tab) {   //Run a query for the active tab info
        var tab = tab[0];
        if (tab.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/game.*mode=[01238]/g) || tab.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/dash.*mode=[01238]/g)) {  
            //Find out what gamemode is being played
            chrome.tabs.getSelected(null, function(tab) {
                console.log('Beginning game');
                console.log(`url: ${tab.url}`);

                gamemode = tab.url[tab.url.length - 1]; //Get the last character of the current url (number from 0 to 4)
                console.log(`gamemode: ${gamemode}`);
                if (gamemode != "8") {      //If not speaking mode
                    chrome.tabs.sendMessage(tab.id, {job: 'begin_task', mode: mode, accuracy: accuracy, delay: delay});
                } else {
                    chrome.tabs.executeScript(tab.id, { code:   //Execute script to answer speaking mode, this is here to bypass usual question reading
                        `var speakingAnswerer = setInterval(function() {
                            document.getElementById("record-button").dispatchEvent(new CustomEvent("mousedown"));
                            new Promise(resolve => setTimeout(resolve, 500)).then(() => {
                                document.getElementById("record-button").dispatchEvent(new CustomEvent("mouseup"));
                                new Promise(resolve => setTimeout(resolve, 500)).then(() => {
                                    if (document.getElementById("correct-button")) {
                                        document.getElementById("correct-button").click();
                                    }
                                })
                            }) 
                        }, ${delay * (8 / 3)});`    //The mutiplication is to make it scale properly in relation to the other gamemode delay's
                    })
                }
            });
        }
    });
}

//When we recieve a message from the question streamer (readquestion.js)
chrome.runtime.onMessage.addListener(function(msg) {
    if (msg.job == "answerQuestion") {

        //Attempt translation with error catch
        try {

            var translatedstring = undefined;

            console.log(`Recieved Question: \"${msg.question}\" from content script.`);

            //alert(gamemode);
            //Use different Map depending on the gamemode
            switch (gamemode) {

                /* GAMEMODE KEY: (TARGET = Language being learnt. BASE = The 1st language of the user)
                0 = TARGET text to Base text
                1 = BASE text to TARGET text
                2 = Spoken TARGET to Base Text
                3 = Spoken TARGET to TARGET Text
                */

                case '0': { //TARGET text to Base text
                    chrome.tabs.query({currentWindow: true, active: true},
                        function (tabArray) {
                            //Strip The question of it's punctuation and whitespace then run it through the map
                            translatedstring = lantoeng.get(msg.question.replace(/ *\([^)]*\) */g, "").replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""));
                            
                            console.log(`Sending answer \"${translatedstring}\" back to content script`);//Log to console
                            if (Math.floor((Math.random() * 100) + 1) <= accuracy || mode == "assist" || mode == "hackerman") {    //Get a random number and compare it with the accuracy value (assist mode bypasses this)
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'answer', answer: translatedstring});
                            }
                            else {
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'answer', answer: "incorrect"});
                            }
                        }
                    );
                    break;
                }

                case '1': { //BASE text to TARGET text
                    chrome.tabs.query({currentWindow: true, active: true},
                        function (tabArray) {
                            //Strip The question of it's punctuation and whitespace then run it through the map
                            translatedstring = engtolan.get(msg.question.replace(/ *\([^)]*\) */g, "").replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""));
                            
                            console.log(`Sending answer \"${translatedstring}\" back to content script`);//Log to console
                            //Send Answer Back to the Content Script
                            if (Math.floor((Math.random() * 100) + 1) <= accuracy || mode == "assist" || mode == "hackerman") {    //Get a random number and compare it with the accuracy value  
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'answer', answer: translatedstring});
                            }
                            else {
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'answer', answer: "incorrect"});
                            }
                        }
                    );
                    break;
                }

                case '2': { //Spoken TARGET to BASE TEXT
                    chrome.tabs.query({currentWindow: true, active: true},
                        function (tabArray) {
                            translatedstring = audtoeng.get(msg.question);
                            
                            console.log(`Sending answer \"${translatedstring}\" back to content script`);//Log to console
                            //Send Answer Back to the Content Script
                            if (Math.floor((Math.random() * 100) + 1) <= accuracy || mode == "assist" || mode == "hackerman") {    //Get a random number and compare it with the accuracy value  
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'answer', answer: translatedstring});
                            }
                            else {
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'answer', answer: "incorrect"});
                            }
                        }
                    );
                    break;
                }

                case '3': { //Spoken TARGET to TARGET TEXT
                    chrome.tabs.query({currentWindow: true, active: true},
                        function (tabArray) {
                            translatedstring = audtolan.get(msg.question);
                            
                            console.log(`Sending answer \"${translatedstring}\" back to content script`);//Log to console
                            //Send Answer Back to the Content Script
                            if (Math.floor((Math.random() * 100) + 1) <= accuracy || mode == "assist" || mode == "hackerman") {    //Get a random number and compare it with the accuracy value  
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'answer', answer: translatedstring});
                            }
                            else {
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'answer', answer: "incorrect"});
                            }
                        }
                    );
                    break;
                }

                //Otherwise the gamemode is unsupported
                default: { 
                    if (msg.question) {
                        alert(`Unsupported Game Mode: ${gamemode}`);
                    }
                    else if (!msg.question) {
                        console.log("No question sent!");
                    }
                }
            }
        }
        catch(error) {
            console.log(error);
        }
    }
    //Check for messages from the popup
    else if (msg.job == "load") {
        load();
    }
    else if (msg.job == "start") {
        mode = msg.mode
        accuracy = msg.accuracy;
        delay = msg.delay
        start();
    }
});