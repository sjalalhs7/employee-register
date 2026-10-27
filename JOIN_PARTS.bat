@echo off
setlocal
cd /d "%~dp0"
if exist Employee_Register_Project.zip del Employee_Register_Project.zip
copy /b Employee_Register.part01 + Employee_Register.part02 + Employee_Register.part03 + Employee_Register.part04 + Employee_Register.part05 Employee_Register_Project.zip >nul
if errorlevel 1 (
  echo Failed to join parts. Make sure all part files are in this folder.
  pause
  exit /b 1
)
echo Project ZIP created: Employee_Register_Project.zip
echo Testing archive integrity is recommended before extracting.
pause
