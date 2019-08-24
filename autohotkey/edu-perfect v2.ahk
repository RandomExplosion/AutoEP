#SingleInstance force
#MaxThreadsPerHotkey 1

^+ENTER::
    ;loop
    ;{
        ;Get current url  NOTE: doesn't work
        WinGetTitle, title, A

        Msgbox, %title%

        ;Sleep, 500  ;Give extension enough time to load the answer
        ;SendRaw, %Clipboard%    ;Send the answer as text by typing it, not by using ctrl v
        ;Send, {ENTER}   ;Press enter to submit the answer
    ;}
return
