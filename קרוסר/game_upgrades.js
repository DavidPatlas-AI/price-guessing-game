// ✅ תוספות שדרוג למשחק
// 1. בחירת רמות קושי (קל/בינוני/קשה)
// 2. מד "מרחק מהמחיר" (progress bar)
// 3. אנליטיקות בסיסיות על ביצועי שחקן

// --- משתנים חדשים ---
var difficulty = 'medium'; // קל, בינוני, קשה
var gameStats = {
  totalAnswered: 0,
  avgError: 0,
  avgTime: 0
};

// --- בחירת רמת קושי ---
function setDifficulty(level) {
  difficulty = level;
  if (level === 'easy') {
    totalQuestions = 10;
    timeRemaining = 40;
  } else if (level === 'hard') {
    totalQuestions = 20;
    timeRemaining = 20;
  } else {
    totalQuestions = 15;
    timeRemaining = 30;
  }
}

// --- הצגת בר התקדמות של "מרחק מהמחיר" ---
function showErrorBar(userGuess, actualPrice) {
  var difference = Math.abs(userGuess - actualPrice);
  var percentError = Math.min(100, (difference / actualPrice) * 100);
  var bar = document.getElementById('error-bar');
  if (!bar) return;
  bar.style.width = percentError + '%';
  bar.textContent = percentError.toFixed(1) + '%';
  bar.className = percentError <= 10 ? 'bar-good' : percentError <= 30 ? 'bar-medium' : 'bar-bad';
}

// --- עדכון אנליטיקות ---
function updateAnalytics(userGuess, actualPrice, timeUsed) {
  gameStats.totalAnswered++;
  var diff = Math.abs(userGuess - actualPrice);
  var err = (diff / actualPrice) * 100;

  // ממוצע משוקלל
  gameStats.avgError = ((gameStats.avgError * (gameStats.totalAnswered - 1)) + err) / gameStats.totalAnswered;
  gameStats.avgTime = ((gameStats.avgTime * (gameStats.totalAnswered - 1)) + timeUsed) / gameStats.totalAnswered;
}

// --- הצגת אנליטיקות במסך הסיום ---
function showAnalytics() {
  var el = document.getElementById('analytics-display');
  if (!el) return;
  el.innerHTML =
    '<h3>📊 ניתוח ביצועים</h3>' +
    '<p>סה"כ תשובות: ' + gameStats.totalAnswered + '</p>' +
    '<p>שגיאה ממוצעת: ' + gameStats.avgError.toFixed(1) + '%</p>' +
    '<p>זמן ממוצע לשאלה: ' + gameStats.avgTime.toFixed(1) + ' שניות</p>';
  el.classList.remove('hidden');
}

// --- קריאות ממקומות קיימים ---
// ב-submitAnswer וב-submitMultiAnswer נוסיף:
// showErrorBar(userGuess, actualPrice);
// updateAnalytics(userGuess, actualPrice, 30 - timeRemaining);

// בסוף endGame/endMultiplayerGame נוסיף:
// showAnalytics();
