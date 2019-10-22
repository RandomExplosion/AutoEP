#NoEnv
#SingleInstance force

lp := 1     ; Default mode toggle
lpas := 1       ; Assist mode toggle
record := []    ; Assist mode text storage
browsers := "Chrome_WidgetWin_0,Chrome_WidgetWin_1"   ; Possible chrome names


loop {  
    if (Clipboard == "autoStartScript4968593563904788-default") {   ; Check for the message from the extension. Yes, it communicates with the clipbaord. No, this was not a bad idea (because it works)
        lp := 0     ; Value that is 0 when default mode is running
        while (lp == 0) {
            sURL := GetActiveBrowserURL()  ; Grab the current open url on chrome
            if (sURL != "") {       ; Check if it is blank (then you aren't on chrome)
                StringRight, lastChars, sURL, 6 ; Cut the url to be just the last 6 characters
                StringTrimRight, lastChars, lastChars, 1    ; Remove the last character (as this can change depending on the gamemode)
                if (lastChars != "mode=") {     ; Check if you aren't on the game page, if you aren't then stop the script
                    lp := 1
                }
            } else {        ; Exit the script if you aren't on chrome
                lp := 1
            }
            Clipwait 1, 0       ; This will wait 0.5 seconds for the clipboard to update, before continuing the script, if nothing is found. It currently just pastes the last thing in the clipboard
            ;if (ErrorLevel) {}   ; This means nothing was copied to the clipboard
            Sendraw %Clipboard% ; Send the clipboard, uses sendraw so it can't mess with anything
            Send {ENTER}   
            Clipboard := "" ; Empty the clipboard
        }
    }
    if (RegExMatch(Clipboard, "autoStartScript4968593563904788-assist-.") > 0) {    ; The string also has the match level, so we check it with a regex wildcard
        StringRight, accuracy, Clipboard, 2 ; Save the last two characters of the input string, this is the match level
        lpas := 0 
        record := []
        while (lpas == 0) {
            sURL := GetActiveBrowserURL()  
            if (sURL != "") {     
                StringRight, lastChars, sURL, 6
                StringTrimRight, lastChars, lastChars, 1 
                if (lastChars != "mode=") {  
                    lpas := 1	
                }
            } else {    
                lpas := 1
            }
        }
    }
}

^+A::	; [CTRL] + [SHIFT] + A		!!!Hold it down to stop the script, you can't just tap it
	lp := 1
return

$ENTER:: 
    if (lpas == 0) {    ; Check if assist mode is currently running
        str := ""
        for index, value in record {
            str .= value
        }
        clip := clipboard

        sim := Similarity(str, clip)        ; Check the similarity and if it is within the accuracy then delete the entered text and enter the keyboard
        if (sim > accuracy && sim < 100) {
            Send, ^a
            Sendraw, %Clipboard%
        }
    }
    record := []
    Send, {ENTER}
return


Similarity(a,b) {       ; Check the similarity of two strings, returns a precentage
	StringSplit, a,a
	StringSplit, b,b
	LoopCount := (a0 > b0) ? a0 : b0
	Loop, % LoopCount
	{
		if (a%A_Index% = b%A_index%)
			matches++
	}
	return (matches = "") ? 0 : Round(matches/LoopCount*100)
}

GetActiveBrowserURL() {
	global browsers
	WinGetClass, sClass, A
	if sClass In % browsers	; Check if what the url was pulled from is in the browser list
		return GetBrowserURL_ACC(sClass)
	else	; If it is not, return nothing
		return ""
}

GetBrowserURL_DDE(sClass) {
	WinGet, sServer, ProcessName, % "ahk_class " sClass
	StringTrimRight, sServer, sServer, 4
	iCodePage := A_IsUnicode ? 0x04B0 : 0x03EC 
	DllCall("DdeInitialize", "UPtrP", idInst, "Uint", 0, "Uint", 0, "Uint", 0)
	hServer := DllCall("DdeCreateStringHandle", "UPtr", idInst, "Str", sServer, "int", iCodePage)
	hTopic := DllCall("DdeCreateStringHandle", "UPtr", idInst, "Str", "WWW_GetWindowInfo", "int", iCodePage)
	hItem := DllCall("DdeCreateStringHandle", "UPtr", idInst, "Str", "0xFFFFFFFF", "int", iCodePage)
	hConv := DllCall("DdeConnect", "UPtr", idInst, "UPtr", hServer, "UPtr", hTopic, "Uint", 0)
	hData := DllCall("DdeClientTransaction", "Uint", 0, "Uint", 0, "UPtr", hConv, "UPtr", hItem, "UInt", 1, "Uint", 0x20B0, "Uint", 10000, "UPtrP", nResult) 
	sData := DllCall("DdeAccessData", "Uint", hData, "Uint", 0, "Str")
	DllCall("DdeFreeStringHandle", "UPtr", idInst, "UPtr", hServer)
	DllCall("DdeFreeStringHandle", "UPtr", idInst, "UPtr", hTopic)
	DllCall("DdeFreeStringHandle", "UPtr", idInst, "UPtr", hItem)
	DllCall("DdeUnaccessData", "UPtr", hData)
	DllCall("DdeFreeDataHandle", "UPtr", hData)
	DllCall("DdeDisconnect", "UPtr", hConv)
	DllCall("DdeUninitialize", "UPtr", idInst)
	csvWindowInfo := StrGet(&sData, "CP0")
	StringSplit, sWindowInfo, csvWindowInfo, `" ;"; comment to avoid a syntax highlighting issue in autohotkey.com/boards
	return sWindowInfo2
}

GetBrowserURL_ACC(sClass) {
	global nWindow, accAddressBar
	if (nWindow != WinExist("ahk_class " sClass)) { ; Reuses accAddressBar if it's the same window
		nWindow := WinExist("ahk_class " sClass)
		accAddressBar := GetAddressBar(Acc_ObjectFromWindow(nWindow))
	}
	try sURL := accAddressBar.accValue(0)
	if (sURL == "") { 
		WinGet, nWindows, List, % "ahk_class " sClass ; In case of a nested browser window as in the old CoolNovo (TO DO: check if still needed)
		if (nWindows > 1) {
			accAddressBar := GetAddressBar(Acc_ObjectFromWindow(nWindows2))
			Try sURL := accAddressBar.accValue(0)
		}
	}
	if ((sURL != "") and (SubStr(sURL, 1, 4) != "http")) ; Modern browsers omit "http://"
		sURL := "http://" sURL
	if (sURL == "")
		nWindow := -1 ; Forget the window if there is no URL
	return sURL
}

GetAddressBar(accObj) {
	try if ((accObj.accRole(0) == 42) and IsURL(accObj.accValue(0)))
		return accObj
	try if ((accObj.accRole(0) == 42) and IsURL("http://" accObj.accValue(0))) ; Modern browsers omit "http://"
		return accObj
	for nChild, accChild in Acc_Children(accObj)
		if IsObject(accAddressBar := GetAddressBar(accChild))
			return accAddressBar
}

IsURL(sURL) {   ; Check whether parsed value is a url or not
	;return RegExMatch(sURL, "^(?<Protocol>https?|ftp)://(?<Domain>(?:[\w-]+\.)+\w\w+)(?::(?<Port>\d+))?/?(?<Path>(?:[^:/?# ]*/?)+)(?:\?(?<Query>[^#]+)?)?(?:\#(?<Hash>.+)?)?$")	 
	return RegExMatch(sURL, "^(?<Protocol>https?|ftp)://")
}


; The below code if from the Acc library
Acc_Init() {
	static h
	if Not h
		h:=DllCall("LoadLibrary","Str","oleacc","Ptr")
}
Acc_ObjectFromWindow(hWnd, idObject = 0) {
	Acc_Init()
	if DllCall("oleacc\AccessibleObjectFromWindow", "Ptr", hWnd, "UInt", idObject&=0xFFFFFFFF, "Ptr", -VarSetCapacity(IID,16)+NumPut(idObject==0xFFFFFFF0?0x46000000000000C0:0x719B3800AA000C81,NumPut(idObject==0xFFFFFFF0?0x0000000000020400:0x11CF3C3D618736E0,IID,"Int64"),"Int64"), "Ptr*", pacc)=0
	return ComObjEnwrap(9,pacc,1)
}
Acc_Query(Acc) {
	try return ComObj(9, ComObjQuery(Acc,"{618736e0-3c3d-11cf-810c-00aa00389b71}"), 1)
}
Acc_Children(Acc) {
	if ComObjType(Acc,"Name") != "IAccessible"
		ErrorLevel := "Invalid IAccessible Object"
	else {
		Acc_Init(), cChildren:=Acc.accChildCount, Children:=[]
		if DllCall("oleacc\AccessibleChildren", "Ptr",ComObjValue(Acc), "Int",0, "Int",cChildren, "Ptr",VarSetCapacity(varChildren,cChildren*(8+2*A_PtrSize),0)*0+&varChildren, "Int*",cChildren)=0 {
			loop %cChildren%
				i:=(A_Index-1)*(A_PtrSize*2+8)+8, child:=NumGet(varChildren,i), Children.Insert(NumGet(varChildren,i-8)=9?Acc_Query(child):child), NumGet(varChildren,i-8)=9?ObjRelease(child):
			return Children.MaxIndex()?Children:
		} else
			ErrorLevel := "AccessibleChildren DllCall Failed"
	}
}





$a::
    record.push("a")
    Send, a
return

$b::
    record.push("b")
    Send, b
return

$c::
    record.push("c")
    Send, c
return

$d::
    record.push("d")
    Send, d
return

$e::
    record.push("e")
    Send, e
return

$f::
    record.push("f")
    Send, f
return

$g::
    record.push("g")
    Send, g
return

$h::
    record.push("h")
    Send, h
return

$i::
    record.push("i")
    Send, i
return

$j::
    record.push("j")
    Send, j
return

$k::
    record.push("k")
    Send, k
return

$l::
    record.push("l")
    Send, l
return

$m::
    record.push("m")
    Send, m
return

$n::
    record.push("n")
    Send, n
return

$o::
    record.push("o")
    Send, o
return

$p::
    record.push("p")
    Send, p
return

$q::
    record.push("q")
    Send, q
return

$r::
    record.push("r")
    Send, r
return

$s::
    record.push("s")
    Send, s
return

$t::
    record.push("t")
    Send, t
return

$u::
    record.push("u")
    Send, u
return

$v::
    record.push("v")
    Send, v
return

$w::
    record.push("w")
    Send, w
return

$y::
    record.push("y")
    Send, y
return

$x::
    record.push("x")
    Send, x
return

$z::
    record.push("z")
    Send, z
return
