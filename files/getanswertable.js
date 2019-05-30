// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
        chrome.tabs.sendMessage(tab.id, {text: 'requesting_list'}, StoreTableData);
        if (msg.text == 'requesting_list') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        //sendResponse(document.all[0].outerHTML);
        var lantable = document.querySelectorAll(".targetLanguage");
        var engtable = document.querySelectorAll(".baseLanguage");
        alert(document.innerHTML);
        sendResponse(lantable, engtable);
        
    }
});