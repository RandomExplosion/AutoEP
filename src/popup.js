function load()
{  
    chrome.browserAction.onClicked.dispatchEvent(event)
}

function start()
{
    var amount = document.getElementById('amount').value
    if (amount != "")
    {
        //Limited
    } 
    else
    {
        //Infinite
    }
}

function stop()
{
    //Stop
}

document.getElementById('load').addEventListener('click', load);      //Listen for when the user clicks the load table button and call the load function
document.getElementById('start').addEventListener('click', start);      //Listen for when the user clicks the start button and call the start function
document.getElementById('stop').addEventListener('click', stop);       //Listen for when the user clicks the stop button and call the stop function