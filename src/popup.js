showHide();

var element = document.getElementById('advanced');     
if (element) 
{
    document.getElementById("advanced").addEventListener('click', function()    //Event listener for when the 'advanced' button is clicked
    {
        showHide();
    });
}

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
        //figure out how to run an external file
    });
}

function showHide() 
{
    var x = document.getElementById("advanced-options");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}