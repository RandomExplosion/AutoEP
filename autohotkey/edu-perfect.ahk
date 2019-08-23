#SingleInstance force
#MaxThreadsPerHotkey 2

^+ENTER::

    toggle := !toggle

    loop
    {
        If not toggle
            break

        Sleep, 500
        SendRaw, %Clipboard%
        Send, {ENTER}
    }
return