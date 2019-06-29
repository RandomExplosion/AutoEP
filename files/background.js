//Array for the target language table
let lantoeng = new Map();
let engtolan = new Map();

//The background page
let bkg = chrome.extension.getBackgroundPage();

// A function to use as callback
function StoreTableData_Target(lannodes) 
{   
    bkg.console.log("Recieved Language Nodes");
    bkg.console.log("Lan Nodes: " + lannodes);
}   

function StoreTableData_English(engnodes) 
{   
    bkg.console.log("Recieved English Nodes!");
    bkg.console.log("Eng Nodes: " + engnodes);
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

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) { 

    bkg.console.log('Requesting Table content...');  

        //Request Table Data (Target Language)
        chrome.tabs.sendMessage(tab.id, {text: 'requesting_lan'}, StoreTableData_Target);
        
        //Request Table Data (Base Language)
        chrome.tabs.sendMessage(tab.id, {text: 'requesting_eng'}, StoreTableData_English);

        //}
});

function LanTextToEng(stopat)
{

}