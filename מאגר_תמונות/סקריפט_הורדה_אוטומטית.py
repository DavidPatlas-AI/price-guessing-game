#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🤖 סקריפט הורדת תמונות אוטומטית למשחק המחירים העתידני
הסקריפט יוריד תמונות איכותיות מ-Unsplash ו-Pexels אוטומטית

דרישות:
pip install requests pillow

הפעלה:
python סקריפט_הורדה_אוטומטית.py
"""

import requests
import os
import json
import time
from urllib.parse import quote
from pathlib import Path

# הגדרות
UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY"  # צריך להירשם ב-Unsplash
PEXELS_API_KEY = "YOUR_PEXELS_API_KEY"  # צריך להירשם ב-Pexels

# רשימת המוצרים להורדה
PRODUCTS = {
    "מחשבים_ואלקטרוניקה": [
        {"name": "עכבר_מחשב", "search": "computer mouse white background"},
        {"name": "מקלדת", "search": "mechanical keyboard"},
        {"name": "מחשב_נייד", "search": "modern laptop computer"},
        {"name": "סמארטפון", "search": "smartphone mobile phone"}
    ],
    "מוצרי_חשמל": [
        {"name": "מקרר", "search": "stainless steel refrigerator"},
        {"name": "טלוויזיה_55", "search": "flat screen television"},
        {"name": "מיקרוגל", "search": "microwave oven kitchen"},
        {"name": "קומקום_חשמלי", "search": "electric kettle modern"}
    ],
    "מזון_ומשקאות": [
        {"name": "תפוחים", "search": "fresh red apples"},
        {"name": "חלב", "search": "milk bottle glass"},
        {"name": "לחם_פרוס", "search": "sliced bread loaf"},
        {"name": "שוקולד", "search": "chocolate bar milk"}
    ],
    "משחקים_וצעצועים": [
        {"name": "לגו_קטן", "search": "colorful building blocks"},
        {"name": "פאזל_300", "search": "jigsaw puzzle pieces"},
        {"name": "משחק_קופסה", "search": "board game family"},
        {"name": "בובת_סופר_הירו", "search": "action figure superhero"}
    ],
    "ביגוד_והנעלה": [
        {"name": "חולצת_טי", "search": "white t-shirt"},
        {"name": "נעלי_ספורט", "search": "white sneakers"},
        {"name": "ג'ינס", "search": "blue jeans denim"},
        {"name": "משקפי_שמש", "search": "sunglasses black"}
    ]
}

def create_directories():
    """יצירת תיקיות לתמונות"""
    base_dir = Path("מאגר_תמונות")
    base_dir.mkdir(exist_ok=True)
    
    for category in PRODUCTS.keys():
        category_dir = base_dir / category
        category_dir.mkdir(exist_ok=True)
        print(f"✅ יצרתי תיקיה: {category_dir}")

def download_from_unsplash(search_term, output_path):
    """הורדת תמונה מ-Unsplash"""
    if not UNSPLASH_ACCESS_KEY or UNSPLASH_ACCESS_KEY == "YOUR_UNSPLASH_ACCESS_KEY":
        print("❌ נדרש מפתח API של Unsplash")
        return False
    
    url = f"https://api.unsplash.com/search/photos"
    params = {
        "query": search_term,
        "per_page": 1,
        "orientation": "landscape",
        "order_by": "relevant"
    }
    headers = {
        "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"
    }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if data["results"]:
            image_url = data["results"][0]["urls"]["regular"]
            img_response = requests.get(image_url)
            img_response.raise_for_status()
            
            with open(output_path, "wb") as f:
                f.write(img_response.content)
            
            print(f"✅ הורדתי מ-Unsplash: {output_path}")
            return True
    except Exception as e:
        print(f"❌ שגיאה בהורדה מ-Unsplash: {e}")
    
    return False

def download_from_pexels(search_term, output_path):
    """הורדת תמונה מ-Pexels"""
    if not PEXELS_API_KEY or PEXELS_API_KEY == "YOUR_PEXELS_API_KEY":
        print("❌ נדרש מפתח API של Pexels")
        return False
    
    url = "https://api.pexels.com/v1/search"
    params = {
        "query": search_term,
        "per_page": 1,
        "orientation": "landscape"
    }
    headers = {
        "Authorization": PEXELS_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if data["photos"]:
            image_url = data["photos"][0]["src"]["large"]
            img_response = requests.get(image_url)
            img_response.raise_for_status()
            
            with open(output_path, "wb") as f:
                f.write(img_response.content)
            
            print(f"✅ הורדתי מ-Pexels: {output_path}")
            return True
    except Exception as e:
        print(f"❌ שגיאה בהורדה מ-Pexels: {e}")
    
    return False

def download_fallback_image(search_term, output_path):
    """הורדת תמונה ללא API - קישורים ישירים"""
    # רשימת קישורים ישירים לתמונות איכותיות
    fallback_urls = {
        "computer mouse": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
        "mechanical keyboard": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
        "laptop computer": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80",
        "smartphone": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
        "refrigerator": "https://images.unsplash.com/photo-1571175653734-1eb4b7b9b176?w=800&q=80",
        "television": "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&q=80",
        "microwave": "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80",
        "electric kettle": "https://images.unsplash.com/photo-1586985289906-406988974504?w=800&q=80",
        "red apples": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80",
        "milk bottle": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80",
        "bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
        "chocolate": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
        "building blocks": "https://images.unsplash.com/photo-1558060370-d140dbdc1d2f?w=800&q=80",
        "puzzle": "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80",
        "t-shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        "sneakers": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
    }
    
    # חיפוש במפתח הקרוב ביותר
    for key, url in fallback_urls.items():
        if any(word in search_term.lower() for word in key.split()):
            try:
                response = requests.get(url)
                response.raise_for_status()
                
                with open(output_path, "wb") as f:
                    f.write(response.content)
                
                print(f"✅ הורדתי תמונת fallback: {output_path}")
                return True
            except Exception as e:
                print(f"❌ שגיאה בהורדת fallback: {e}")
    
    return False

def download_all_images():
    """הורדת כל התמונות"""
    print("🚀 מתחיל הורדת תמונות...")
    
    create_directories()
    
    total_images = sum(len(products) for products in PRODUCTS.values())
    downloaded = 0
    
    for category, products in PRODUCTS.items():
        print(f"\n📁 מעבד קטגוריה: {category}")
        
        for product in products:
            output_path = Path("מאגר_תמונות") / category / f"{product['name']}.jpg"
            
            if output_path.exists():
                print(f"⏭️ קובץ כבר קיים: {output_path}")
                downloaded += 1
                continue
            
            print(f"🔍 מחפש: {product['search']}")
            
            # נסה Unsplash קודם
            if download_from_unsplash(product["search"], output_path):
                downloaded += 1
            # אם נכשל, נסה Pexels
            elif download_from_pexels(product["search"], output_path):
                downloaded += 1
            # אם גם זה נכשל, נסה fallback
            elif download_fallback_image(product["search"], output_path):
                downloaded += 1
            else:
                print(f"❌ נכשל בהורדת: {product['name']}")
            
            # המתן קצת בין הורדות
            time.sleep(1)
    
    print(f"\n🎉 סיימתי! הורדתי {downloaded}/{total_images} תמונות")
    print(f"📁 התמונות נשמרו בתיקיה: מאגר_תמונות/")

def main():
    """פונקציה ראשית"""
    print("🎮 מוריד תמונות למשחק המחירים העתידני")
    print("=" * 50)
    
    # בדיקה אם יש מפתחות API
    if UNSPLASH_ACCESS_KEY == "YOUR_UNSPLASH_ACCESS_KEY":
        print("⚠️ לא הוגדר מפתח Unsplash - אשתמש בתמונות fallback")
    
    if PEXELS_API_KEY == "YOUR_PEXELS_API_KEY":
        print("⚠️ לא הוגדר מפתח Pexels - אשתמש בתמונות fallback")
    
    print("\n💡 טיפ: לאיכות מיטבית, השג מפתחות API מ:")
    print("   - Unsplash: https://unsplash.com/developers")
    print("   - Pexels: https://www.pexels.com/api/")
    
    input("\n🚀 לחץ Enter להתחיל הורדה...")
    
    download_all_images()
    
    print("\n🎯 המשחק עכשיו מוכן עם תמונות יפות!")
    print("📋 בדוק את התיקיות שנוצרו ואת איכות התמונות")

if __name__ == "__main__":
    main()
