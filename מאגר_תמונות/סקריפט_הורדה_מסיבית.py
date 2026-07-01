#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔥 סקריפט הורדה מסיבית - המון תמונות למשחק!
יוריד מעל 100 תמונות איכותיות בבת אחת!

הפעלה:
python סקריפט_הורדה_מסיבית.py
"""

import requests
import os
import time
from pathlib import Path

# רשימת תמונות מסיבית להורדה
MASSIVE_IMAGES = {
    "מחשבים_ואלקטרוניקה": [
        # מוצרים קיימים
        ("מצלמה_דיגיטלית.jpg", "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80"),
        ("רמקול_נייד.jpg", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80"),
        ("חיישן_תנועה.jpg", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80"),
        ("בלוטות'_אוזניות.jpg", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"),
        ("זרוע_מיקרופון.jpg", "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80"),
        ("USB_דיסק.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        ("כרטיס_זיכרון.jpg", "https://images.unsplash.com/photo-1567473030492-533b30c5494c?w=800&q=80"),
        ("מטען_אלחוטי.jpg", "https://images.unsplash.com/photo-1619641805634-0b0d3a6fb3c9?w=800&q=80"),
        ("כבל_HDMI.jpg", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"),
        ("מפצל_USB.jpg", "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80"),
        ("מסך_נייד.jpg", "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800&q=80"),
        ("מעמד_טאבלט.jpg", "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80"),
        ("משקפי_VR.jpg", "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80"),
        ("שעון_חכם.jpg", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"),
        ("מחשב_שולחני.jpg", "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80"),
        ("מעבד_מחשב.jpg", "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80"),
    ],
    "מוצרי_חשמל": [
        ("מקרר_גדול.jpg", "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80"),
        ("מכונת_כביסה_חדשה.jpg", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"),
        ("מייבש_כביסה.jpg", "https://images.unsplash.com/photo-1558618753-bd30c78371dc?w=800&q=80"),
        ("מאוורר_תקרה.jpg", "https://images.unsplash.com/photo-1520177480862-441b17c87c37?w=800&q=80"),
        ("מחמם_שמן.jpg", "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa7?w=800&q=80"),
        ("מזגן.jpg", "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80"),
        ("מכונת_קפה_אספרסו.jpg", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80"),
        ("טוסטר.jpg", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"),
        ("מעבד_מזון.jpg", "https://images.unsplash.com/photo-1574781330855-d0db0021a9d3?w=800&q=80"),
        ("מיקסר.jpg", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"),
        ("תנור_חימום.jpg", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80"),
        ("מגהץ.jpg", "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80"),
        ("שואב_אבק_רובוטי.jpg", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"),
        ("מנורת_LED.jpg", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"),
        ("רדיו.jpg", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80"),
    ],
    "מזון_ומשקאות": [
        # ירקות
        ("מלפפונים.jpg", "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&q=80"),
        ("גזר.jpg", "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&q=80"),
        ("בצל.jpg", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80"),
        ("תפוחי_אדמה.jpg", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80"),
        ("חסה.jpg", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"),
        ("פלפל_אדום.jpg", "https://images.unsplash.com/photo-1544631007-3fe20aa31dd5?w=800&q=80"),
        ("ברוקולי.jpg", "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&q=80"),
        # פירות
        ("תפוזים.jpg", "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=800&q=80"),
        ("לימונים.jpg", "https://images.unsplash.com/photo-1568471173653-d4e01bbced79?w=800&q=80"),
        ("אבטיח.jpg", "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80"),
        ("ענבים.jpg", "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&q=80"),
        ("תותים.jpg", "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80"),
        ("קיווי.jpg", "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=800&q=80"),
        ("אגס.jpg", "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80"),
        # מוצרי חלב
        ("חמאה.jpg", "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80"),
        ("שמנת.jpg", "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80"),
        ("גבינה_צהובה.jpg", "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80"),
        ("קוטג'.jpg", "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80"),
        # בשר ודגים
        ("עוף_שלם.jpg", "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&q=80"),
        ("בקר.jpg", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80"),
        ("דג_סלמון.jpg", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"),
        ("טונה.jpg", "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80"),
        # מאפים
        ("עוגיות.jpg", "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"),
        ("עוגה.jpg", "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80"),
        ("מאפינס.jpg", "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80"),
        ("רולדה.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        # משקאות
        ("קולה.jpg", "https://images.unsplash.com/photo-1567103472667-6898e6c6cc24?w=800&q=80"),
        ("בירה.jpg", "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80"),
        ("יין.jpg", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80"),
        ("מים_מינרליים.jpg", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80"),
        ("קפה.jpg", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80"),
    ],
    "משחקים_וצעצועים": [
        ("רכבת_צעצוע.jpg", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80"),
        ("מכונית_צעצוע.jpg", "https://images.unsplash.com/photo-1469037784699-7e5da15040ba?w=800&q=80"),
        ("בובת_תינוק.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        ("דובי.jpg", "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&q=80"),
        ("פאזל_1000.jpg", "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80"),
        ("משחק_שח.jpg", "https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?w=800&q=80"),
        ("משחק_דמקה.jpg", "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80"),
        ("קוביית_רוביק.jpg", "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80"),
        ("יו_יו.jpg", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"),
        ("פריזבי.jpg", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80"),
        ("סקייט_בורד.jpg", "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&q=80"),
        ("קורקינט.jpg", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80"),
        ("בול_פגיעה.jpg", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80"),
        ("חבל_קפיצה.jpg", "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80"),
        ("חישוקי_הולה.jpg", "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"),
        ("בועות_סבון.jpg", "https://images.unsplash.com/photo-1616490710008-d9e5cb9a8cc6?w=800&q=80"),
        ("משחק_זיכרון.jpg", "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80"),
        ("דמיונות.jpg", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"),
        ("כדור_כדורגל.jpg", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80"),
        ("כדור_כדורסל.jpg", "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"),
    ],
    "ביגוד_והנעלה": [
        ("גרביים.jpg", "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80"),
        ("תחתונים.jpg", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"),
        ("חליפה.jpg", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"),
        ("קרדיגן.jpg", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"),
        ("ג'קט.jpg", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"),
        ("הודי.jpg", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"),
        ("מכנסיים_קצרים.jpg", "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80"),
        ("חצאית.jpg", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"),
        ("נעלי_בית.jpg", "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80"),
        ("סנדלים.jpg", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"),
        ("מגפיים.jpg", "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80"),
        ("נעלי_ריצה.jpg", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"),
        ("חגורה.jpg", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"),
        ("ארנק.jpg", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"),
        ("תיק_יד.jpg", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"),
        ("עניבה.jpg", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"),
    ],
    "ספורט": [
        ("רקט_טניס.jpg", "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80"),
        ("כדור_טניס.jpg", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"),
        ("אופניים.jpg", "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80"),
        ("הליכון.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        ("משקולות.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        ("כפפות_כושר.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        ("מזרן_יוגה.jpg", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"),
        ("כדור_פילאטיס.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        ("חבל_כושר.jpg", "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80"),
        ("שעון_ספורט.jpg", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"),
        ("נעלי_כדורגל.jpg", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"),
        ("מגיני_שוקיים.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        ("קסדה.jpg", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80"),
        ("משקפי_שחייה.jpg", "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80"),
        ("כדור_כדורעף.jpg", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80"),
    ],
    "לימודים": [
        ("תיק_בית_ספר.jpg", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"),
        ("עפרונות_צבעוניים.jpg", "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80"),
        ("סרגל.jpg", "https://images.unsplash.com/photo-1567059230214-5dc3e27e7c6d?w=800&q=80"),
        ("מחדד.jpg", "https://images.unsplash.com/photo-1567059230214-5dc3e27e7c6d?w=800&q=80"),
        ("מדבקות.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"),
        ("מחברת_ספירלה.jpg", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"),
        ("לוח_מחיק.jpg", "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80"),
        ("מכונת_חישוב.jpg", "https://images.unsplash.com/photo-1564111195950-d45c68b99c57?w=800&q=80"),
        ("כדור_הארץ.jpg", "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80"),
        ("מיקרוסקופ.jpg", "https://images.unsplash.com/photo-1567427018141-02f8f4080543?w=800&q=80"),
        ("בוחן_זכוכית.jpg", "https://images.unsplash.com/photo-1567427018141-02f8f4080543?w=800&q=80"),
        ("פלייר.jpg", "https://images.unsplash.com/photo-1567059230214-5dc3e27e7c6d?w=800&q=80"),
    ],
    "בית_וגן": [
        ("ספה.jpg", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"),
        ("שולחן.jpg", "https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80"),
        ("כיסא.jpg", "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80"),
        ("מיטה.jpg", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80"),
        ("ארון.jpg", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"),
        ("שטיח.jpg", "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"),
        ("וילון.jpg", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"),
        ("מנורה.jpg", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"),
        ("מראה.jpg", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"),
        ("תמונה.jpg", "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80"),
        ("עציץ.jpg", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"),
        ("פרח.jpg", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"),
        ("מזלג_גינה.jpg", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"),
        ("מזרקה.jpg", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"),
        ("גרילין.jpg", "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80"),
    ]
}

def create_directories():
    """יצירת כל התיקיות הנדרשות"""
    base_dir = Path("מאגר_תמונות")
    base_dir.mkdir(exist_ok=True)
    
    for category in MASSIVE_IMAGES.keys():
        category_dir = base_dir / category
        category_dir.mkdir(exist_ok=True)
        print(f"✅ יצרתי תיקיה: {category_dir}")

def download_image(url, file_path):
    """הורדת תמונה בודדת"""
    try:
        response = requests.get(url, stream=True, timeout=10)
        response.raise_for_status()
        
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return True
    except Exception as e:
        print(f"❌ שגיאה בהורדת {file_path.name}: {e}")
        return False

def main():
    """פונקציה ראשית"""
    print("🔥 מתחיל הורדה מסיבית של תמונות!")
    print("=" * 60)
    
    create_directories()
    
    base_path = Path("מאגר_תמונות")
    total_downloaded = 0
    total_images = sum(len(images) for images in MASSIVE_IMAGES.values())
    
    print(f"🎯 יעד: {total_images} תמונות חדשות!")
    print("")
    
    for category, images in MASSIVE_IMAGES.items():
        category_path = base_path / category
        
        print(f"📁 מעבד קטגוריה: {category} ({len(images)} תמונות)")
        print("-" * 50)
        
        category_downloaded = 0
        
        for filename, url in images:
            file_path = category_path / filename
            
            if file_path.exists():
                print(f"⏭️  קיים כבר: {filename}")
                total_downloaded += 1
                category_downloaded += 1
                continue
            
            print(f"⬇️  מוריד: {filename}...", end=" ")
            
            if download_image(url, file_path):
                print("✅")
                total_downloaded += 1
                category_downloaded += 1
            else:
                print("❌")
            
            # המתן קצר בין הורדות
            time.sleep(0.3)
        
        print(f"📊 הורדתי {category_downloaded}/{len(images)} תמונות בקטגוריה זו")
        print("")
    
    print("🎉 הורדה מסיבית הושלמה!")
    print("=" * 60)
    print(f"📊 סה\"כ הורדתי: {total_downloaded}/{total_images} תמונות")
    print(f"🎯 אחוז הצלחה: {(total_downloaded/total_images)*100:.1f}%")
    print(f"📁 כל התמונות במאגר_תמונות/")
    
    # בדיקת התוצאות
    print(f"\n📋 סיכום מפורט לפי קטגוריות:")
    print("-" * 40)
    for category in MASSIVE_IMAGES.keys():
        category_path = base_path / category
        if category_path.exists():
            count = len(list(category_path.glob("*.jpg")))
            print(f"   📂 {category}: {count} תמונות")
    
    print(f"\n🎮 המשחק עכשיו מוכן עם מאגר תמונות ענק!")
    print(f"✨ תהנה מהמשחק החדש והמשופר!")

if __name__ == "__main__":
    main()
