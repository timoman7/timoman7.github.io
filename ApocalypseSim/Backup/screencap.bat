@ECHO off

:10

powershell -Command - <screencap.ps1
TIMEOUT 1 /nobreak

goto 10
pause
