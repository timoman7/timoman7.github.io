@ECHO off
:10
tasklist /v /FO "CSV" > %USERPROFILE%\Desktop\ChromeTask\sketch.js\taskTxt.txt 1> %USERPROFILE%\Desktop\ChromeTask\sketch.js\tempTxt.txt
:fix
ping 1.1.1.1 /w 2000 /n 1 > nul:
for /f "tokens=1*" %%a in (%USERPROFILE%\Desktop\ChromeTask\sketch.js\taskTxt.txt) do (
set taskL=%%a
)
setlocal enableextensions 
for /f "tokens=1*" %%a in (
%USERPROFILE%\Desktop\ChromeTask\sketch.js\tempTxt.txt
) do (
set myvar=%%a 
)
set _taskL=%taskL:"=%
set _myvar=%myvar:"=%
set __taskL=%_taskL:,= %
set __myvar=%_myvar:,= %
SET _endbitL=%__taskL:* =%
SET _endbitM=%__myvar:* =%
CALL SET ___taskL=%%__taskL:%_endbitL%=%%
CALL SET ___myvar=%%__myvar:%_endbitM%=%%
IF /I ___taskL NEQ ___myvar (
	echo Copying
	copy %USERPROFILE%\Desktop\ChromeTask\sketch.js\tempTxt.txt %USERPROFILE%\Desktop\ChromeTask\sketch.js\yes.txt
	endlocal
	goto 10
) else (
	echo Going to fix
	echo %___taskL%
	echo %___myvar%
	endlocal
	goto fix
)
goto 10
pause