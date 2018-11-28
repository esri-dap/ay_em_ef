@echo off
setlocal
call :find_bin

set "_BIN_DIR=" && %_BIN_DIR%..\..\..\..\llvm\prebuilt\windows-x86_64\bin\clang.exe -target x86_64-linux-android %*
if ERRORLEVEL 1 exit /b 1
goto :done

:find_bin
rem Accommodate a quoted arg0, e.g.: "clang"
rem https://github.com/android-ndk/ndk/issues/616
set _BIN_DIR=%~dp0
exit /b

:done
