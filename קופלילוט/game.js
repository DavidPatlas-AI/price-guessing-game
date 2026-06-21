// משתני המשחק הגלובליים
let current = null;
let score = 0;
let tries = 0;
let streak = 0;
let inputVal = '';
let gameStartTime = null;
let bestScore = localStorage.getItem('bestScore') || 0;

// אלמנטים מה-DOM
const lcd = document.getElementById('lcd');
const receiptBody = document.querySelector('#receiptTable tbody');
const achievementsBox = document.getElementById('achievements');
const beep = document.getElementById('beep');
const clap = document.getElementById('clap');
const buzz = document.getElementById('buzz');

// פונקציות עזר
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomMessage(category) {
  const messages = ENCOURAGEMENT_MESSAGES[category];
  return pick(messages);
}

function showGameTip() {
  if (tries > 0 && tries % 3 === 0) {
    const tip = pick(GAME_TIPS);
    showNotification(tip, 'info');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'info' ? '#2196F3' : '#4CAF50'};
    color: white;
    padding: 12px 20px;
    border-radius: 10px;
    z-index: 1000;
    animation: slideIn 0.5s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// יצירת אפקט CSS לנוטיפיקציה
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// פונקציות המשחק
function nextProduct() {
  const level = document.getElementById('levelSelect').value;
  const pool = LEVELS[level];
  
  if (pool.length === 0) {
    showNotification('אין מוצרים ברמה זו!', 'warning');
    return;
  }
  
  current = pick(pool);
  document.getElementById('p-emoji').textContent = current.אייקון;
  document.getElementById('p-name').textContent = current.שם;
  document.getElementById('p-meta').textContent = `${current.קטגוריה} • ${level}`;
  document.getElementById('resultBox').textContent = 'מוכן';
  inputVal = '';
  lcd.textContent = '₪0';
  
  // הצגת טיפ מדי פעם
  showGameTip();
  
  // התחלת זמן המשחק
  if (!gameStartTime) {
    gameStartTime = Date.now();
  }
}

function showAchievement(achievement) {
  const el = document.createElement('div');
  el.className = 'achievement';
  el.textContent = achievement.name;
  el.title = achievement.description;
  achievementsBox.prepend(el);
  
  // אפקט צליל להישג
  if (clap) clap.play();
  
  setTimeout(() => {
    if (el.parentNode) {
      el.remove();
    }
  }, 5000);
}

function calculateScore(diff) {
  if (diff === 0) return 15; // ניחוש מושלם
  if (diff <= 0.05) return 12; // דיוק מעולה (עד 5%)
  if (diff <= 0.1) return 10;  // דיוק טוב (עד 10%)
  if (diff <= 0.3) return 6;   // דיוק בינוני (עד 30%)
  if (diff <= 0.5) return 3;   // דיוק נמוך (עד 50%)
  return 1; // ניחוש רחוק
}

function updateStreak(diff) {
  if (diff <= 0.1) {
    streak++;
  } else {
    streak = 0;
  }
  
  // בדיקת השגת שיא אישי
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
    showNotification('🏆 שיא אישי חדש!', 'success');
  }
}

function checkGuess() {
  if (!current) return;
  
  const guess = Number(inputVal || 0);
  const ref = current.מחיר;
  const diff = Math.abs(guess - ref) / ref;
  
  // חישוב נקודות
  const pts = calculateScore(diff);
  score += pts;
  tries++;
  
  // עדכון רצף
  updateStreak(diff);
  
  // עדכון תצוגה
  document.getElementById('stat-score').textContent = score;
  document.getElementById('stat-tries').textContent = tries;
  
  // הוספה לקבלה
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${current.אייקון} ${current.שם}</td>
    <td>₪${guess}</td>
    <td>₪${ref}</td>
    <td style="color: ${diff <= 0.1 ? 'green' : diff <= 0.3 ? 'orange' : 'red'}">
      ${(diff*100).toFixed(1)}%
    </td>
  `;
  receiptBody.prepend(tr);
  
  // הודעת תוצאה עם עידוד
  let message, messageType;
  if (diff === 0) {
    message = getRandomMessage('perfect');
    messageType = 'perfect';
  } else if (diff <= 0.1) {
    message = getRandomMessage('good');
    messageType = 'good';
  } else if (diff <= 0.3) {
    message = getRandomMessage('okay');
    messageType = 'okay';
  } else {
    message = getRandomMessage('poor');
    messageType = 'poor';
  }
  
  document.getElementById('resultBox').textContent = 
    `${message} מחיר: ₪${ref} ניחוש: ₪${guess} (+${pts})`;
  
  // צלילים
  if (diff === 0 && clap) {
    clap.play();
  } else if (diff <= 0.1 && beep) {
    beep.play();
  } else if (buzz) {
    buzz.play();
  }
  
  // בדיקת הישגים
  ACHIEVEMENTS.forEach(achievement => {
    if (achievement.cond(diff, tries, streak)) {
      showAchievement(achievement);
    }
  });
  
  // מעבר למוצר הבא אחרי השהיה קצרה
  setTimeout(() => {
    nextProduct();
  }, 2000);
}

function clearInput() {
  inputVal = '';
  lcd.textContent = '₪0';
}

function shareScore() {
  const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
  const avgScore = tries > 0 ? (score / tries).toFixed(1) : 0;
  
  const text = `🎮 שיחקתי ב"הקופה הקטנה פלוס"!
📊 צברתי ${score} נקודות ב-${tries} ניסיונות
⭐ ממוצע: ${avgScore} נקודות לניחוש
⏱️ זמן משחק: ${gameTime} שניות
🏆 השיא שלי: ${bestScore} נקודות

בואו תנסו גם! 🎯`;

  if (navigator.share) {
    navigator.share({ 
      title: 'הקופה הקטנה פלוס',
      text: text 
    }).catch(err => {
      // אם השיתוף נכשל, העתק לקליפבורד
      navigator.clipboard.writeText(text);
      showNotification('📋 הועתק ללוח!', 'success');
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    showNotification('📋 הועתק ללוח!', 'success');
  } else {
    // פתרון חלופי לדפדפנים ישנים
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification('📋 הועתק ללוח!', 'success');
  }
}

function resetGame() {
  score = 0;
  tries = 0;
  streak = 0;
  gameStartTime = null;
  inputVal = '';
  
  document.getElementById('stat-score').textContent = '0';
  document.getElementById('stat-tries').textContent = '0';
  document.getElementById('resultBox').textContent = 'המשחק אופס';
  
  // ניקוי הקבלה
  receiptBody.innerHTML = '';
  
  // ניקוי הישגים
  achievementsBox.innerHTML = '';
  
  showNotification('🔄 המשחק אופס!', 'info');
  
  // התחלה מחדש
  setTimeout(nextProduct, 1000);
}

// מאזיני אירועים
function initializeEventListeners() {
  // לחיצה על LCD לבדיקת ניחוש
  lcd.addEventListener('click', checkGuess);
  
  // כפתורי המקלדת
  document.querySelectorAll('.keypad button').forEach(btn => {
    btn.addEventListener('click', () => {
      inputVal += btn.dataset.num;
      lcd.textContent = '₪' + inputVal;
      if (beep) beep.play();
    });
  });
  
  // כפתורי הטאבים
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.getElementById('game').style.display = 
        btn.dataset.tab === 'game' ? 'block' : 'none';
      document.getElementById('receipt').style.display = 
        btn.dataset.tab === 'receipt' ? 'block' : 'none';
    });
  });
  
  // מצב לילה
  document.getElementById('darkToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    showNotification(isDark ? '🌙 מצב לילה' : '☀️ מצב יום', 'info');
  });
  
  // שחזור מצב לילה מהזיכרון
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
  
  // שינוי רמת קושי
  document.getElementById('levelSelect').addEventListener('change', () => {
    showNotification('🎯 רמת קושי שונתה!', 'info');
    nextProduct();
  });
  
  // קיצורי מקלדת
  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      inputVal += e.key;
      lcd.textContent = '₪' + inputVal;
      if (beep) beep.play();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      checkGuess();
    } else if (e.key === 'Escape' || e.key === 'Delete') {
      clearInput();
    } else if (e.key === 'r' || e.key === 'R') {
      if (e.ctrlKey) {
        e.preventDefault();
        resetGame();
      }
    }
  });
  
  // כפתור ניקוי (אם יתווסף)
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearInput);
  }
}

// אתחול המשחק
function initGame() {
  console.log('🎮 הקופה הקטנה פלוס מתאתחלת...');
  
  // הצגת שיא אישי
  if (bestScore > 0) {
    showNotification(`🏆 השיא שלך: ${bestScore} נקודות`, 'success');
  }
  
  // אתחול מאזיני אירועים
  initializeEventListeners();
  
  // התחלת המשחק הראשון
  nextProduct();
  
  console.log('✅ המשחק מוכן!');
}

// הרצה כשהעמוד נטען
document.addEventListener('DOMContentLoaded', initGame);

// הוספת פונקציות גלובליות שנדרשות בHTML
window.shareScore = shareScore;
window.resetGame = resetGame;
window.clearInput = clearInput;
