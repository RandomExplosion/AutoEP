#SingleInstance force
#MaxThreadsPerHotkey 2

^+a::
toggle = true
loop
{
    If (toggle = false) {
        break
    }

    Send ^v{ENTER} ; Press [CTRL] + V + ENTER to paste the text
    Sleep 100 ; Sleep for 100 ms to give the extension time to get the next answer
}
return

^+q::
toggle = false