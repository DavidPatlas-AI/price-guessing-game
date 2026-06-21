@echo off
chcp 65001 >nul
title 🔥 הורדה מסיבית של תמונות למשחק

echo.
echo ==========================================
echo 🔥 הורדה מסיבית של תמונות למשחק המחירים
echo      מעל 100 תמונות איכותיות!
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

:: הפעלת הסקריפט המסיבי
echo.
echo 🔥 מתחיל הורדה מסיבית...
echo 🎯 יעד: מעל 100 תמונות איכותיות
echo ⏱️  זה יקח כמה דקות...
echo.
python "סקריפט_הורדה_מסיבית.py"

echo.
echo 🎉 ההורדה המסיבית הושלמה!
echo 📁 בדוק את כל הקטגוריות החדשות במאגר_תמונות/
echo 🎮 המשחק עכשיו עם המון תמונות יפות!
echo.
pause
