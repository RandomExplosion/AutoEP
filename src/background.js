//Array for the target language table
let lantoeng = new Map();
let engtolan = new Map();

//The background page
let bkg = chrome.extension.getBackgroundPage();

//Callback Function For table data request
function StoreTableData(tabledata) 
{   
    if (tabledata != undefined)
    {
        bkg.console.log("Recieved Table Data!");
        bkg.console.log("Creating Dictionaries");
        for (let i = 0; i < tabledata.length; i++) //For every phrase (both languages)
        {
            lantoeng.set(tabledata[i][0], tabledata[i][1]); //Add it to the Target Language - Base Language Dictionary
            engtolan.set(tabledata[i][1], tabledata[i][0]); //Add it to the Base Language - Target Language Dictionary
        }   
    } 
    else
    {
        bkg.console.error("Table is Empty!?");
    }
}   

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
    if (changeInfo.status == 'complete' && tab.active) 
    {
        //If the current url is a vocabulary list
        if (tab.url.match(/https:\/\/www.educationperfect.com\/app\/#\/.*list-starter.*/g))
        {
            alert("Injecting Script to Read Table");
            chrome.tabs.executeScript(null, {
                file: 'getanswertable.js'
            });
        }
    }
    
}); 

//When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) { 

    bkg.console.log('Requesting Table content...');  

        //Request Table Data
        chrome.tabs.sendMessage(tab.id, {text: 'requesting_table'}, StoreTableData);
    
});

//Translate a string from the Target Language to the Base Language
function LanTextToEng(text2translate)
{
    if (lantoeng.has(text2translate)) //Check if this phrase is in the dictionary
    {
        let translatedtext = lantoeng.get(text2translate); //Retrieve Translated version from the dictionary
        return translatedtext; //Return the Translated Text
    }
    else 
    {
        bkg.console.error("Dictionary Does Not Contain An Entry For This!");
    }
}

//Translate a string from the Base Language to the Target Language
function EngTextToLan(text2translate)
{
    if (engtolan.has(text2translate)) //Check if this phrase is in the dictionary
    {
        let translatedtext = engtolan.get(text2translate); //Retrieve Translated version from the dictionary
        return translatedtext; //Return the Translated Text
    }
    else 
    {
        bkg.console.error("Dictionary Does Not Contain An Entry For This!");
    }
}