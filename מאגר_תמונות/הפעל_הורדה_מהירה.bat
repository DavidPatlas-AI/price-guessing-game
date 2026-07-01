@echo off
chcp 65001 >nul
title 🚀 הורדה מהירה של תמונות למשחק

echo.
echo ==========================================
echo 🚀 הורדה מהירה של תמונות למשחק המחירים
echo ==========================================
echo.

:: בדיקה אם Python מותקן
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python לא מותקן במערכת
    echo 💡 הורד Python מכאן: https://python.org
    pause
    exit /b 1
)

echo ✅ Python מותקן במערכת

:: התקנת requests אם לא קיים
echo.
echo 📦 מוודא שקיימת ספריית requests...
pip install requests >nul 2>&1

:: הפעלת הסקריפט
echo.
echo 🎯 מוריד המון תמונות איכותיות...
echo ⏱️  זה יקח כמה דקות...
echo.
python "סקריפט_הורדה_מהיר.py"

echo.
echo 🎉 ההורדה הושלמה!
echo 📁 בדוק את התיקיות שנוצרו במאגר_תמונות/מאגר_תמונות/
echo 🎮 המשחק עכשיו יטען את התמונות אוטומטית!
echo.
pause
