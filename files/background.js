// Regex-pattern to check URLs against. 
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
//var urlRegex = "https://www.educationperfect.com/*list-starter*"

//Array for the target language table
var lantoeng;
var engtolan;

//The background page
var bkg;

// A function to use as callback
function StoreTableData(lannodes, engnodes) 
{
    lantoeng = new Map();
    engtolan = new Map();

    console.log("LanTable" + lannodes);
    console.log("EngTable" + engnodes);

    // for (let i = 0; i < engnodes.length; i++) 
    // {
    //     //const element = tablenodes[i];
    //     let cureng = engnodes[i].getChild;
    //     let curlan = lannodes[i].getChild;
    //     //Add data from the current HTML element to lantoeng
    //     lantoeng.set(curlan.textContent, cureng.textContent);
    //     //Add data from the current HTML element to engtolan
    //     lantoeng.set(cureng.textContent, curlan.textContent);

    //     console.log("LanTable" + lannodes);
    //     console.log("EngTable" + engnodes);

    // }
}   

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {

    bkg = chrome.extension.getBackgroundPage();

    bkg.console.log('Requesting Table content...');

    // ...check the URL of the active tab against our pattern and...
    //if (urlRegex.test(tab.url)) {

        
        // ...if it matches, send a message specifying a callback too
        chrome.tabs.sendMessage(tab.id, {text: 'requesting_list'}, StoreTableData);
        debugger;
        //}
});

function LanTextToEng(stopat)
{

}