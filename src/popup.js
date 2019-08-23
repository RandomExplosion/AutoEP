


var element = document.getElementById('set');     
if (element) 
{
    document.getElementById("set").addEventListener('click', function()    //Event listener for when the 'set' button is clicked
    {
        //Pass the data to ahk script
        var delay = document.getElementById('delay').value;
        if (delay == "") {
            delay = "300"
        }
        showHide();
        alert("Delay set to " + delay + "ms");
        // TODO: Set ahk script config
    });
}