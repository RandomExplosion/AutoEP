#MaxThreadsPerHotkey 2
^+a::
Toggle := !Toggle
loop
{
    If not Toggle
        break
    Send ^v{ENTER} ; Press [CTRL] + V + ENTER to paste the text
    Sleep 300 ; Sleep for 300 ms to give the extension time to get the next answer
}
return