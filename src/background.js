//Array for the target language table
let lantoeng = new Map();
let engtolan = new Map();

//The background page
let bkg = chrome.extension.getBackgroundPage();

//Stores The Current Gamemode
var gamemode; 

//Stores The Currently Active Url
//var url = undefined;

//Callback Function For table data request
function StoreTableData(tabledata) {   
    if (tabledata != undefined){
        console.log('Recieved Table Data!');
        console.log('Creating Dictionaries');

        for (let i = 0; i < tabledata.length; i++){ //For every phrase (both languages)
            lantoeng.set(tabledata[i][0].replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""), tabledata[i][1].replace(/;/g, ",")); //Add it to the Target Language - Base Language Dictionary
            engtolan.set(tabledata[i][1].replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""), tabledata[i][0].replace(/;/g, ",")); //Add it to the Base Language - Target Language Dictionary
        }   
    } 
    else{   
        console.error('Table is Empty!?');
    }
}   

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (changeInfo.status == 'complete' && tab.active) 
    {
        //If the current webpage is a vocabulary list
        if (tab.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*list-starter.*/g)){
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
        else if (tab.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*\/test-statistics/g)){
            console.log('Game Finished!');
        }
    }
    
    
});

//When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function(tab) 
{
    //If the current url is a vocabulary list
    if (tab.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*list-starter.*/g)){
        //Log to the console for Debugging Purposes
        console.log('Requesting Table content...');  

        //Request Table Data
        chrome.tabs.sendMessage(tab.id, {text: 'requesting_table'}, StoreTableData);
    }
    
    //Otherwise if the current webpage is a game being played
    else if (tab.url.match(/https:\/\/www\.educationperfect\.com\/app\/#\/.*\/game.*mode=[0123]/g)){  
        //Find out what gamemode is being played
        chrome.tabs.getSelected(null, function(tab) {
            console.log('Beginning game');
            console.log(`url: ${tab.url}`);
            gamemode = tab.url[tab.url.length - 1]; //Get the last character of the current url (number from 0 to 4)
            console.log(`gamemode: ${gamemode}`);
            chrome.tabs.sendMessage(tab.id, {job: 'begin_task'});
        });
    }
    
});

//When we recieve a message from the question streamer (readquestion.js)
chrome.runtime.onMessage.addListener(function(msg){
    if (msg.question){
        
        //debugger;

        //Attempt translation with error catch
        try{

            var translatedstring = undefined;

            console.log(`Recieved Question: \"${msg.question}\" from content script.`);
            console.log(`Removing Whitespace and Punctuation: \"${msg.question.replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,"")}\" from content script.`);

            //Use different Map depending on the gamemode
            switch (gamemode){

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
                            translatedstring = lantoeng.get(msg.question.replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""));
                            
                            console.log(`Sending answer \"${translatedstring}\" back to content script`);//Log to console
                            //Send Answer Back to the Content Script
                            chrome.tabs.sendMessage(tabArray[0].id, {job: 'copy', answer: translatedstring});
                        }
                    );
                    
                break;

                case '1': //BASE text to TARGET text
                    chrome.tabs.query({
                        currentWindow: true, active: true },
                        function (tabArray) {
                      
                            //Strip The question of it's punctuation and whitespace then run it through the map
                            translatedstring = engtolan.get(msg.question.replace(/[.,\/#!$%\^ &\*;:{}=\-_`~()]/g,""));
                            
                            console.log(`Sending answer \"${translatedstring}\" back to content script`);//Log to console
                            //Send Answer Back to the Content Script
                            chrome.tabs.sendMessage(tabArray[0].id, {job: 'copy', answer: translatedstring});
                        }
                    );
                break;

                case '2': //Spoken TARGET to BASE TEXT <NOT IMPLIMENTED>
                    throw "*Spoken* TARGET to BASE *Text* is not currently supported!";

                case '3': //Spoken TARGET to TARGET TEXT <NOT IMPLIMENTED>
                    throw "*Spoken* TARGET to TARGET *Text* is not currently supported!";

                //Otherwise the gamemode is unsupported
                default:
                console.error(`Unsupported Game Mode: ${gamemode}`);
                break;
            }
        }
        catch(error){
            alert(error);
        }
    }
    else{
        console.error("No Question Sent!");
    }
});
        

        

