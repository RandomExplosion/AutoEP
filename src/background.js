//Array for the target language table
let lantoeng = new Map();
let engtolan = new Map();

//The background page
let bkg = chrome.extension.getBackgroundPage();

//Stores The Current Gamemode
var gamemode; 

//Stores the accuracy
var accuracy;

//Stores The Currently Active Url
//var url = undefined;

const sleep = (milliseconds) => {       //Function to pause script for an amount of milliseconds
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//Callback Function For table data request
function StoreTableData(tabledata) {   
    if (tabledata != undefined){
        console.log('Recieved Table Data!');
        console.log('Creating Dictionaries');

        for (let i = 0; i < tabledata.length; i++) { //For every phrase (both languages)
                                       //First remove anything in brackets, then any leftover punctuation
            lantoeng.set(tabledata[i][0].replace(/ *\([^)]*\) */g, "").replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""), tabledata[i][1].replace(/;/g, ",")); //Add it to the Target Language - Base Language Dictionary
            engtolan.set(tabledata[i][1].replace(/ *\([^)]*\) */g, "").replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""), tabledata[i][0].replace(/;/g, ",")); //Add it to the Base Language - Target Language Dictionary
        }   
    } 
    else {   
        console.error('Table is Empty!?');
        //alert("Tabble is empty!?");
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
        else if (tab.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/game.*mode=[0123]/g)) {
            console.log('Injecting Script to Play Game >:)');
            
            chrome.tabs.executeScript(tabId, {
                file: 'readquestions.js'
            });
        }

        //If current webpage is the test completed page
        else if (tab.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*\/test-statistics/g)) {
            console.log('Game Finished!');
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
        if (tab.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/game.*mode=[0123]/g)) {  
            //Find out what gamemode is being played
            chrome.tabs.getSelected(null, function(tab) {
                console.log('Beginning game');
                console.log(`url: ${tab.url}`);

                gamemode = tab.url[tab.url.length - 1]; //Get the last character of the current url (number from 0 to 4)
                console.log(`gamemode: ${gamemode}`);
                chrome.tabs.sendMessage(tab.id, {job: 'copy', answer: 'autoStartScript138952254848'});  //Copy this unique string to the clipboard, the ahk script is listening for this to start
                sleep(50).then(() => { // Wait 50ms to give the ahk script time to start
                    chrome.tabs.sendMessage(tab.id, {job: 'begin_task'});
                })
            });
        }
    });
}

//When we recieve a message from the question streamer (readquestion.js)
chrome.runtime.onMessage.addListener(function(msg) {
    if (msg.question) {
        
        //debugger;

        //Attempt translation with error catch
        try {

            var translatedstring = undefined;

            console.log(`Recieved Question: \"${msg.question}\" from content script.`);
            console.log(`Removing Whitespace and Punctuation: \"${msg.question.replace(/ *\([^)]*\) */g, "").replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,"")}\" from content script.`);

            //alert(gamemode);
            //Use different Map depending on the gamemode
            switch (gamemode) {

            /* GAMEMODE KEY: (TARGET = Language being learnt. BASE = The 1st language of the user)
            0 = TARGET text to Base text
            1 = BASE text to TARGET text
            2 = Spoken TARGET to Base Text
            3 = Spoken TARGET to TARGET Text
            */

                case '0': //0 = TARGET text to Base text
                    chrome.tabs.query({
                        currentWindow: true, active: true },
                        function (tabArray) {
                            //Strip The question of it's punctuation and whitespace then run it through the map
                            translatedstring = lantoeng.get(msg.question.replace(/ *\([^)]*\) */g, "").replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""));
                            
                            console.log(`Sending answer \"${translatedstring}\" back to content script`);//Log to console
                            if (Math.floor((Math.random() * 100) + 1) <= accuracy) {    //Get a random number and compare it with the accuracy value 
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'copy', answer: translatedstring});
                            }
                        }
                    );
                    
                break;

                case '1': //BASE text to TARGET text
                    chrome.tabs.query( {
                        currentWindow: true, active: true },
                        function (tabArray) {
                      
                            //Strip The question of it's punctuation and whitespace then run it through the map
                            translatedstring = engtolan.get(msg.question.replace(/ *\([^)]*\) */g, "").replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""));
                            
                            console.log(`Sending answer \"${translatedstring}\" back to content script`);//Log to console
                            //Send Answer Back to the Content Script
                            if (Math.floor((Math.random() * 100) + 1) <= accuracy) {    //Get a random number and compare it with the accuracy value  
                                chrome.tabs.sendMessage(tabArray[0].id, {job: 'copy', answer: translatedstring});
                            }
                        }
                    );
                break;

                case '2': //Spoken TARGET to BASE TEXT <NOT IMPLIMENTED>
                    throw "*Spoken* TARGET to BASE *Text* is not currently supported!";

                case '3': //Spoken TARGET to TARGET TEXT <NOT IMPLIMENTED>
                    throw "*Spoken* TARGET to TARGET *Text* is not currently supported!";

                //Otherwise the gamemode is unsupported
                default:
                //alert(`Unsupported Game Mode: ${gamemode}`);
                console.log(`Unsupported Game Mode: ${gamemode}`);
                break;
            }
        }
        catch(error) {
            console.error(error);
        }
    }
    //Check for messages from the popup
    else if (msg.job == "load") {
        load();
    }
    else if (msg.job == "start") {
        accuracy = msg.accuracy;
        start();
    }
    else {
        console.log("No Question Sent!")
    }
});