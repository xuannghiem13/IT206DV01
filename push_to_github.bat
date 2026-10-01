@echo off
chcp 65001 >nul
echo ========================================================
echo   DANG DONG BO & DAY MA NGUON LEN GITHUB: xuannghiem13/IT206DV01
echo ========================================================
cd /d "%~dp0"

echo [1/3] Dong bo file Use Case vao thu muc docs & public...
xcopy /E /I /Y "..\diagrams" "docs\diagrams" >nul 2>&1
xcopy /E /I /Y "..\diagrams" "public\diagrams" >nul 2>&1
copy /Y "..\USE_CASE_DIAGRAM_AND_SPECIFICATION.md" "docs\" >nul 2>&1
copy /Y "..\DIAGRAMS_VIEWER.html" "docs\" >nul 2>&1

echo [2/3] Dang them cac file vao Git...
"C:\Users\NGHIEM VO\AppData\Local\github-copilot-git-2.53.0-4\cmd\git.exe" add .

echo [3/3] Dang Commit va Push len GitHub...
"C:\Users\NGHIEM VO\AppData\Local\github-copilot-git-2.53.0-4\cmd\git.exe" commit -m "docs: cap nhat use case diagrams va tai lieu phan tich UML"
"C:\Users\NGHIEM VO\AppData\Local\github-copilot-git-2.53.0-4\cmd\git.exe" push origin main

echo.
echo ========================================================
echo   HOAN TAT! KIEM TRA TAI: https://github.com/xuannghiem13/IT206DV01
echo ========================================================
pause
