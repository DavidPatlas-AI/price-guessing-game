#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🚀 סקריפט הורדה מהיר של תמונות למשחק
יוריד המון תמונות איכותיות בבת אחת!

הפעלה:
python סקריפט_הורדה_מהיר.py
"""

import requests
import os
import time
from pathlib import Path

# רשימת תמונות להורדה
IMAGES = {
    "מחשבים_ואלקטרוניקה": [
        ("טאבלט.jpg", "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80"),
        ("אוזניות.jpg", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"),
        ("מסך_מחשב.jpg", "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"),
        ("מדפסת.jpg", "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80"),
        ("נתב_אינטרנט.jpg", "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80"),
        ("מטען_נייד.jpg", "https://images.unsplash.com/photo-1609592999113-83ded8aee1b6?w=800&q=80"),
        ("רמקולים.jpg", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80"),
        ("כונן_קשיח.jpg", "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80"),
    ],
    "מוצרי_חשמל": [
        ("מקרר.jpg", "https://images.unsplash.com/photo-1571175653734-1eb4b7b9b176?w=800&q=80"),
        ("מכונת_כביסה.jpg", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80"),
        ("מכונת_קפה.jpg", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80"),
        ("בלנדר.jpg", "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80"),
        ("מאוורר.jpg", "https://images.unsplash.com/photo-1558618873-99d5c1de9b88?w=800&q=80"),
        ("שואב_אבק.jpg", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"),
        ("מחמם_אוויר.jpg", "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa7?w=800&q=80"),
        ("מייבש_שיער.jpg", "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80"),
    ],
    "מזון_ומשקאות": [
        ("בננות.jpg", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80"),
        ("עגבניות.jpg", "https://images.unsplash.com/photo-1546470427-227a3c46e47c?w=800&q=80"),
        ("גבינה.jpg", "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80"),
        ("יוגורט.jpg", "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80"),
        ("דגנים.jpg", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80"),
        ("ביצים.jpg", "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=800&q=80"),
        ("מיץ_תפוזים.jpg", "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80"),
        ("פסטה.jpg", "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&q=80"),
        ("אורז.jpg", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"),
        ("פיצה.jpg", "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"),
    ],
    "משחקים_וצעצועים": [
        ("לגו_קטן.jpg", "https://images.unsplash.com/photo-1558060370-d140dbdc1d2f?w=800&q=80"),
        ("לגו_גדול.jpg", "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80"),
        ("משחק_קופסה.jpg", "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80"),
        ("בובת_ברבי.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        ("רובוט_צעצוע.jpg", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"),
        ("כדור.jpg", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80"),
        ("קטר_צעצוע.jpg", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80"),
        ("משחק_וידאו.jpg", "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80"),
    ],
    "ביגוד_והנעלה": [
        ("ג'ינס.jpg", "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=800&q=80"),
        ("משקפי_שמש.jpg", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"),
        ("תיק_גב.jpg", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"),
        ("שעון.jpg", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"),
        ("כובע.jpg", "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80"),
        ("מעיל.jpg", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"),
        ("נעלי_עקב.jpg", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"),
        ("שמלה.jpg", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"),
    ]
}

def download_image(url, file_path):
    """הורדת תמונה בודדת"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return True
    except Exception as e:
        print(f"❌ שגיאה בהורדת {file_path}: {e}")
        return False

def main():
    """פונקציה ראשית"""
    print("🚀 מתחיל הורדת תמונות מהירה!")
    print("=" * 50)
    
    base_path = Path("מאגר_תמונות")
    total_downloaded = 0
    total_images = sum(len(images) for images in IMAGES.values())
    
    for category, images in IMAGES.items():
        category_path = base_path / category
        category_path.mkdir(parents=True, exist_ok=True)
        
        print(f"\n📁 מעבד קטגוריה: {category}")
        print("-" * 30)
        
        for filename, url in images:
            file_path = category_path / filename
            
            if file_path.exists():
                print(f"⏭️  קיים כבר: {filename}")
                total_downloaded += 1
                continue
            
            print(f"⬇️  מוריד: {filename}...")
            
            if download_image(url, file_path):
                print(f"✅ הושלם: {filename}")
                total_downloaded += 1
            else:
                print(f"❌ נכשל: {filename}")
            
            # המתן קצר בין הורדות
            time.sleep(0.5)
    
    print(f"\n🎉 הורדה הושלמה!")
    print(f"📊 הורדתי {total_downloaded}/{total_images} תמונות")
    print(f"📁 כל התמונות במאגר_תמונות/")
    
    # בדיקת התוצאות
    print(f"\n📋 סיכום לפי קטגוריות:")
    for category in IMAGES.keys():
        category_path = base_path / category
        if category_path.exists():
            count = len(list(category_path.glob("*.jpg")))
            print(f"   {category}: {count} תמונות")

if __name__ == "__main__":
    main()
