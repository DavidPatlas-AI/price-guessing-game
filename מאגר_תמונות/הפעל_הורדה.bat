@echo off
chcp 65001 >nul
title 🎮 הורדת תמונות למשחק המחירים העתידני

echo.
echo ========================================
echo 🎮 מוריד תמונות למשחק המחירים העתידני
echo ========================================
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

:: התקנת ספריות נדרשות
echo.
echo 📦 מתקין ספריות נדרשות...
pip install requests pillow

:: הפעלת הסקריפט
echo.
echo 🚀 מפעיל סקריפט הורדה...
python "סקריפט_הורדה_אוטומטית.py"

echo.
echo 🎉 ההורדה הושלמה!
echo 📁 בדוק את התיקיות שנוצרו
echo.
pause
