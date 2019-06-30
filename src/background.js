//Array for the target language table
let lantoeng = new Map();
let engtolan = new Map();

//The background page
let bkg = chrome.extension.getBackgroundPage();

//Callback Function For table data request
function StoreTableData_English(tabledata) 
{   
    if (tabledata)
    {
        bkg.console.log("Recieved Table Data!");
        bkg.console.log("Table Data: " + tabledata);
    } 
    else
    {
        bkg.console.console.error("Table Data Is NULL!");
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
        chrome.tabs.sendMessage(tab.id, {text: 'requesting_lan'}, StoreTableData_Target);
    
        //}
});

function LanTextToEng(stopat)
{

}