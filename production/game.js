// Game State Management
class GameState {
  constructor() {
    this.currentProduct = null;
    this.currentPrice = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.totalQuestions = 0;
    this.correctAnswers = 0;
    this.gameHistory = [];
    this.currentDifficulty = 'medium';
    this.timeRemaining = 30;
    this.timerInterval = null;
    this.gameData = null;
    this.achievements = [];
    this.studentList = [];
    this.currentStudentIndex = 0;
    this.classMode = false;
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
  }

  reset() {
    this.currentProduct = null;
    this.currentPrice = 0;
    this.score = 0;
    this.streak = 0;
    this.totalQuestions = 0;
    this.correctAnswers = 0;
    this.gameHistory = [];
    this.timeRemaining = 30;
    this.clearTimer();
  }

  addToHistory(item) {
    this.gameHistory.push(item);
    this.saveToStorage();
  }

  saveToStorage() {
    const saveData = {
      score: this.score,
      bestStreak: this.bestStreak,
      totalQuestions: this.totalQuestions,
      correctAnswers: this.correctAnswers,
      gameHistory: this.gameHistory.slice(-50), // Keep last 50 games
      achievements: this.achievements,
      isDarkMode: this.isDarkMode
    };
    localStorage.setItem('cashRegisterGame', JSON.stringify(saveData));
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('cashRegisterGame');
      if (saved) {
        const data = JSON.parse(saved);
        this.bestStreak = data.bestStreak || 0;
        this.achievements = data.achievements || [];
        // Don't load current game state, just persistent data
      }
    } catch (error) {
      console.error('Error loading save data:', error);
    }
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

// Game instance
const game = new GameState();

// DOM Elements
const elements = {
  // Game elements
  productImage: document.getElementById('productImage'),
  productEmoji: document.getElementById('productEmoji'),
  productName: document.getElementById('productName'),
  productMeta: document.getElementById('productMeta'),
  productHint: document.getElementById('productHint'),
  priceValue: document.getElementById('priceValue'),
  sliderTrack: document.getElementById('sliderTrack'),
  sliderFill: document.getElementById('sliderFill'),
  sliderHandle: document.getElementById('sliderHandle'),
  handleTooltip: document.getElementById('handleTooltip'),
  maxLabel: document.getElementById('maxLabel'),
  
  // Controls
  levelSelect: document.getElementById('levelSelect'),
  submitBtn: document.getElementById('submitBtn'),
  hintBtn: document.getElementById('hintBtn'),
  skipBtn: document.getElementById('skipBtn'),
  
  // Display
  score: document.getElementById('score'),
  streak: document.getElementById('streak'),
  timer: document.getElementById('timer'),
  resultDisplay: document.getElementById('resultDisplay'),
  resultText: document.getElementById('resultText'),
  resultDetails: document.getElementById('resultDetails'),
  resultPoints: document.getElementById('resultPoints'),
  
  // Tabs
  tabBtns: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  // Other controls
  darkToggle: document.getElementById('darkToggle'),
  helpBtn: document.getElementById('helpBtn'),
  helpModal: document.getElementById('helpModal'),
  closeHelp: document.getElementById('closeHelp'),
  
  // Quick buttons
  quickBtns: document.querySelectorAll('.quick-btn'),
  
  // Teacher mode
  className: document.getElementById('className'),
  gameMode: document.getElementById('gameMode'),
  maxQuestions: document.getElementById('maxQuestions'),
  startClassGame: document.getElementById('startClassGame'),
  studentName: document.getElementById('studentName'),
  addStudent: document.getElementById('addStudent'),
  studentsGrid: document.getElementById('studentsGrid'),
  
  // Receipt
  receiptDate: document.getElementById('receiptDate'),
  receiptItems: document.getElementById('receiptItems'),
  totalQuestions: document.getElementById('totalQuestions'),
  correctAnswers: document.getElementById('correctAnswers'),
  averageAccuracy: document.getElementById('averageAccuracy'),
  finalScore: document.getElementById('finalScore'),
  printReceipt: document.getElementById('printReceipt'),
  shareResults: document.getElementById('shareResults'),
  
  // Achievements
  achievementsGrid: document.getElementById('achievementsGrid'),
  totalGames: document.getElementById('totalGames'),
  totalScore: document.getElementById('totalScore'),
  bestStreak: document.getElementById('bestStreak'),
  avgAccuracy: document.getElementById('avgAccuracy')
};

// Price Slider Management
class PriceSlider {
  constructor() {
    this.isDragging = false;
    this.maxPrice = 10000;
    this.currentPercentage = 0;
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!elements.sliderHandle || !elements.sliderTrack) return;

    // Mouse events
    elements.sliderHandle.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.endDrag.bind(this));

    // Touch events
    elements.sliderHandle.addEventListener('touchstart', this.startDrag.bind(this));
    document.addEventListener('touchmove', this.drag.bind(this));
    document.addEventListener('touchend', this.endDrag.bind(this));

    // Track click
    elements.sliderTrack.addEventListener('click', this.clickTrack.bind(this));

    // Quick buttons
    elements.quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const value = parseInt(btn.dataset.value);
        this.setValue(value);
      });
    });
  }

  startDrag(e) {
    this.isDragging = true;
    elements.sliderHandle.classList.add('dragging');
    e.preventDefault();
  }

  drag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    
    const percentage = this.getPercentageFromEvent(e);
    this.updateSlider(percentage);
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    elements.sliderHandle.classList.remove('dragging');
  }

  clickTrack(e) {
    if (this.isDragging) return;
    const percentage = this.getPercentageFromEvent(e);
    this.updateSlider(percentage);
  }

  getPercentageFromEvent(e) {
    const rect = elements.sliderTrack.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }

  updateSlider(percentage) {
    this.currentPercentage = percentage;
    const price = Math.round((percentage / 100) * this.maxPrice);
    
    game.currentPrice = price;
    elements.priceValue.textContent = price.toLocaleString();
    elements.sliderFill.style.width = percentage + '%';
    elements.sliderHandle.style.left = percentage + '%';
    elements.handleTooltip.textContent = price.toLocaleString() + '₪';
  }

  setValue(value) {
    const percentage = Math.max(0, Math.min(100, (value / this.maxPrice) * 100));
    this.updateSlider(percentage);
  }

  setMaxPrice(maxPrice) {
    this.maxPrice = maxPrice;
    elements.maxLabel.textContent = maxPrice.toLocaleString() + '₪';
    
    // Update quick buttons based on difficulty
    const quickValues = this.getQuickValuesForMax(maxPrice);
    elements.quickBtns.forEach((btn, index) => {
      if (quickValues[index]) {
        btn.dataset.value = quickValues[index];
        btn.textContent = this.formatQuickValue(quickValues[index]);
        btn.style.display = 'block';
      } else {
        btn.style.display = 'none';
      }
    });
    
    // Reset slider
    this.updateSlider(0);
  }

  getQuickValuesForMax(maxPrice) {
    if (maxPrice <= 200) {
      return [5, 10, 25, 50, 100, 150];
    } else if (maxPrice <= 3000) {
      return [10, 50, 100, 500, 1000, 2000];
    } else {
      return [50, 100, 500, 1000, 5000, 8000];
    }
  }

  formatQuickValue(value) {
    if (value >= 1000) {
      return (value / 1000) + 'K₪';
    }
    return value + '₪';
  }
}

// Initialize slider
const priceSlider = new PriceSlider();

// Data Loading and Game Logic
async function loadGameData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('Failed to load game data');
    }
    game.gameData = await response.json();
    console.log('Game data loaded successfully');
  } catch (error) {
    console.error('Error loading game data:', error);
    // Fallback to basic data if JSON fails
    game.gameData = getFallbackData();
  }
}

function getFallbackData() {
  return {
    gameData: {
      easy: [
        { id: 1, category: "מכולת", name: "תפוח", icon: "🍎", price: 5, minPrice: 3, maxPrice: 8, difficulty: 1, hint: "פרי טרי ובריא" }
      ],
      medium: [
        { id: 2, category: "צעצועים", name: "כדור", icon: "⚽", price: 60, minPrice: 30, maxPrice: 120, difficulty: 2, hint: "לספורט וכיף" }
      ],
      hard: [
        { id: 3, category: "אלקטרוניקה", name: "מחשב נייד", icon: "💻", price: 3000, minPrice: 1500, maxPrice: 6000, difficulty: 3, hint: "למשרד ולימודים" }
      ]
    },
    config: {
      maxPrice: 10000,
      pointsSystem: { perfect: 15, excellent: 12, good: 10, fair: 6, poor: 3, miss: 1 }
    }
  };
}

function getRandomProduct() {
  const products = game.gameData.gameData[game.currentDifficulty];
  if (!products || products.length === 0) {
    console.error('No products available for difficulty:', game.currentDifficulty);
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}

function updateProductDisplay() {
  game.currentProduct = getRandomProduct();
  if (!game.currentProduct) return;

  const product = game.currentProduct;
  
  // Update product info
  elements.productEmoji.textContent = product.icon;
  elements.productName.textContent = product.name;
  elements.productMeta.textContent = `${product.category} • רמה ${product.difficulty}`;
  elements.productHint.textContent = product.hint || 'ללא רמז';

  // Try to load product image
  if (product.image) {
    elements.productImage.src = product.image;
    elements.productImage.style.display = 'block';
    elements.productEmoji.style.display = 'none';
    
    elements.productImage.onerror = () => {
      elements.productImage.style.display = 'none';
      elements.productEmoji.style.display = 'block';
    };
  } else {
    elements.productImage.style.display = 'none';
    elements.productEmoji.style.display = 'block';
  }

  // Hide result display
  elements.resultDisplay.style.display = 'none';
  
  // Reset timer
  resetTimer();
}

function calculateScore(userGuess, actualPrice) {
  const difference = Math.abs(userGuess - actualPrice);
  const percentage = (difference / actualPrice) * 100;
  
  let points = 0;
  let category = '';
  
  if (percentage === 0) {
    points = 15;
    category = 'perfect';
  } else if (percentage <= 5) {
    points = 12;
    category = 'excellent';
  } else if (percentage <= 10) {
    points = 10;
    category = 'good';
  } else if (percentage <= 30) {
    points = 6;
    category = 'fair';
  } else if (percentage <= 50) {
    points = 3;
    category = 'poor';
  } else {
    points = 1;
    category = 'miss';
  }

  // Bonus for streak
  if (game.streak > 0 && category !== 'miss') {
    points += Math.min(5, Math.floor(game.streak / 3));
  }

  return { points, percentage, category };
}

function submitAnswer() {
  if (!game.currentProduct || game.currentPrice === 0) {
    showNotification('נא לבחור מחיר תחילה!', 'warning');
    return;
  }

  game.clearTimer();
  
  const result = calculateScore(game.currentPrice, game.currentProduct.price);
  
  // Update game state
  game.totalQuestions++;
  game.score += result.points;
  
  if (result.category !== 'miss' && result.percentage <= 20) {
    game.streak++;
    game.correctAnswers++;
    if (game.streak > game.bestStreak) {
      game.bestStreak = game.streak;
    }
  } else {
    game.streak = 0;
  }

  // Add to history
  const historyItem = {
    product: game.currentProduct.name,
    category: game.currentProduct.category,
    actualPrice: game.currentProduct.price,
    userGuess: game.currentPrice,
    accuracy: result.percentage,
    points: result.points,
    timestamp: new Date().toISOString()
  };
  
  game.addToHistory(historyItem);
  
  // Show result
  showResult(result);
  
  // Update displays
  updateScoreDisplay();
  
  // Check achievements
  checkAchievements();
  
  // Auto next question after delay
  setTimeout(() => {
    updateProductDisplay();
  }, 3000);
}

function showResult(result) {
  const resultText = elements.resultText;
  const resultDetails = elements.resultDetails;
  const resultPoints = elements.resultPoints;
  
  // Set result text and styling
  let message = '';
  let className = '';
  
  switch (result.category) {
    case 'perfect':
      message = '🎯 מושלם! ניחוש מדויק!';
      className = 'correct';
      break;
    case 'excellent':
      message = '🔥 מעולה! קרוב מאוד!';
      className = 'correct';
      break;
    case 'good':
      message = '👍 טוב! ניחוש חכם!';
      className = 'close';
      break;
    case 'fair':
      message = '📈 לא רע, אפשר להשתפר';
      className = 'close';
      break;
    case 'poor':
      message = '📚 טוב לדעת, בפעם הבאה יותר טוב';
      className = 'wrong';
      break;
    case 'miss':
      message = '🎯 לא מדויק, אבל לומדים!';
      className = 'wrong';
      break;
  }
  
  resultText.textContent = message;
  resultText.className = `result-text ${className}`;
  
  // Show details
  const actualPrice = game.currentProduct.price;
  const difference = Math.abs(game.currentPrice - actualPrice);
  const emoji = game.currentPrice > actualPrice ? '📉' : game.currentPrice < actualPrice ? '📈' : '🎯';
  
  resultDetails.textContent = 
    `המחיר האמיתי: ${actualPrice.toLocaleString()}₪ ${emoji} ` +
    `הניחוש שלך: ${game.currentPrice.toLocaleString()}₪ ` +
    `(סטייה: ${result.percentage.toFixed(1)}%)`;
  
  resultPoints.textContent = `+${result.points} נקודות!`;
  
  // Show result display
  elements.resultDisplay.style.display = 'block';
  
  // Add visual effects
  if (result.category === 'perfect' || result.category === 'excellent') {
    createConfetti();
  }
}

function updateScoreDisplay() {
  elements.score.textContent = game.score.toLocaleString();
  elements.streak.textContent = game.streak;
  
  // Update streak styling
  const streakElement = elements.streak.parentElement;
  if (game.streak >= 5) {
    streakElement.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    streakElement.style.color = 'white';
  } else if (game.streak >= 3) {
    streakElement.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    streakElement.style.color = 'white';
  } else {
    streakElement.style.background = '';
    streakElement.style.color = '';
  }
}

function resetTimer() {
  game.timeRemaining = 30;
  elements.timer.textContent = game.timeRemaining;
  
  game.clearTimer();
  
  game.timerInterval = setInterval(() => {
    game.timeRemaining--;
    elements.timer.textContent = game.timeRemaining;
    
    if (game.timeRemaining <= 10) {
      elements.timer.parentElement.style.color = '#ef4444';
      elements.timer.parentElement.style.animation = 'pulse 1s infinite';
    }
    
    if (game.timeRemaining <= 0) {
      game.clearTimer();
      autoSubmit();
    }
  }, 1000);
}

function autoSubmit() {
  if (game.currentPrice === 0) {
    // If no guess made, use median price as guess
    const product = game.currentProduct;
    const medianPrice = Math.round((product.minPrice + product.maxPrice) / 2);
    priceSlider.setValue(medianPrice);
  }
  submitAnswer();
}

// Visual Effects
function createConfetti() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.pointerEvents = 'none';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.zIndex = '9999';
    
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 2000 + 1000,
      easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
    });
    
    animation.onfinish = () => confetti.remove();
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-secondary);
    color: var(--text-primary);
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    animation: slideDown 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideUp 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Event Listeners
function setupEventListeners() {
  // Tab switching
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
    });
  });

  // Game controls
  elements.submitBtn?.addEventListener('click', submitAnswer);
  elements.hintBtn?.addEventListener('click', showHint);
  elements.skipBtn?.addEventListener('click', skipQuestion);

  // Difficulty selection
  elements.levelSelect?.addEventListener('change', (e) => {
    game.currentDifficulty = e.target.value;
    updateDifficultySettings();
    updateProductDisplay();
  });

  // Dark mode toggle
  elements.darkToggle?.addEventListener('click', toggleDarkMode);

  // Help modal
  elements.helpBtn?.addEventListener('click', () => {
    elements.helpModal.classList.add('show');
  });

  elements.closeHelp?.addEventListener('click', () => {
    elements.helpModal.classList.remove('show');
  });

  // Close modal on outside click
  elements.helpModal?.addEventListener('click', (e) => {
    if (e.target === elements.helpModal) {
      elements.helpModal.classList.remove('show');
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);

  // Teacher mode
  elements.addStudent?.addEventListener('click', addStudent);
  elements.startClassGame?.addEventListener('click', startClassGame);

  // Receipt
  elements.printReceipt?.addEventListener('click', printReceipt);
  elements.shareResults?.addEventListener('click', shareResults);
}

function switchTab(tabId) {
  // Update tab buttons
  elements.tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // Update tab contents
  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });

  // Update content based on tab
  if (tabId === 'receipt') {
    updateReceiptDisplay();
  } else if (tabId === 'achievements') {
    updateAchievementsDisplay();
  }
}

function updateDifficultySettings() {
  const maxPrices = {
    easy: 200,
    medium: 3000,
    hard: 10000
  };
  
  priceSlider.setMaxPrice(maxPrices[game.currentDifficulty]);
}

function showHint() {
  if (!game.currentProduct) return;
  
  const hints = [
    `💡 קטגוריה: ${game.currentProduct.category}`,
    `🎯 רמת קושי: ${game.currentProduct.difficulty}/3`,
    `📊 טווח מחירים: ${game.currentProduct.minPrice}-${game.currentProduct.maxPrice}₪`,
    `💭 ${game.currentProduct.hint}`
  ];
  
  const hint = hints.join('\n');
  showNotification(hint, 'info');
  
  // Small penalty for using hint
  if (game.score > 2) {
    game.score -= 2;
    updateScoreDisplay();
  }
}

function skipQuestion() {
  game.streak = 0;
  updateScoreDisplay();
  updateProductDisplay();
  showNotification('❌ שאלה דולגה', 'warning');
}

function toggleDarkMode() {
  game.isDarkMode = !game.isDarkMode;
  document.body.dataset.theme = game.isDarkMode ? 'dark' : 'light';
  elements.darkToggle.textContent = game.isDarkMode ? '☀️ מצב יום' : '🌓 מצב לילה';
  game.saveToStorage();
}

function handleKeyboard(e) {
  // Don't handle if user is typing in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  switch (e.code) {
    case 'Enter':
    case 'Space':
      e.preventDefault();
      submitAnswer();
      break;
    case 'KeyH':
      e.preventDefault();
      showHint();
      break;
    case 'KeyS':
      e.preventDefault();
      skipQuestion();
      break;
    case 'Escape':
      e.preventDefault();
      elements.helpModal.classList.remove('show');
      break;
  }
}

function addStudent() {
  const name = elements.studentName.value.trim();
  if (!name) return;
  
  game.studentList.push({
    name,
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0
  });
  
  elements.studentName.value = '';
  updateStudentsList();
}

function updateStudentsList() {
  if (!elements.studentsGrid) return;
  
  elements.studentsGrid.innerHTML = '';
  
  game.studentList.forEach((student, index) => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
      <h4>${student.name}</h4>
      <div>נקודות: ${student.score}</div>
      <div>דיוק: ${student.questionsAnswered > 0 ? Math.round((student.correctAnswers / student.questionsAnswered) * 100) : 0}%</div>
      <button onclick="removeStudent(${index})">❌</button>
    `;
    elements.studentsGrid.appendChild(card);
  });
}

function removeStudent(index) {
  game.studentList.splice(index, 1);
  updateStudentsList();
}

function startClassGame() {
  if (game.studentList.length === 0) {
    showNotification('נא להוסיף תלמידים תחילה', 'warning');
    return;
  }
  
  game.classMode = true;
  game.currentStudentIndex = 0;
  
  showNotification(`משחק כיתתי התחיל! תור: ${game.studentList[0].name}`, 'success');
  switchTab('game');
  updateProductDisplay();
}

function updateReceiptDisplay() {
  if (!elements.receiptDate) return;
  
  elements.receiptDate.textContent = new Date().toLocaleDateString('he-IL');
  elements.totalQuestions.textContent = game.totalQuestions;
  elements.correctAnswers.textContent = game.correctAnswers;
  elements.averageAccuracy.textContent = game.totalQuestions > 0 ? 
    Math.round((game.correctAnswers / game.totalQuestions) * 100) + '%' : '0%';
  elements.finalScore.textContent = game.score;
  
  // Update receipt items
  if (elements.receiptItems) {
    elements.receiptItems.innerHTML = '';
    
    game.gameHistory.slice(-10).forEach(item => {
      const receiptItem = document.createElement('div');
      receiptItem.className = 'receipt-item';
      receiptItem.innerHTML = `
        <span>${item.product}</span>
        <span>${item.points} נק׳</span>
      `;
      elements.receiptItems.appendChild(receiptItem);
    });
  }
}

function updateAchievementsDisplay() {
  // This would be populated based on the achievements system
  // Implementation depends on the achievements data structure
}

function printReceipt() {
  window.print();
}

function shareResults() {
  const text = `השגתי ${game.score} נקודות במשחק "הקופה הקטנה פרו"! 🏆\n` +
    `דיוק של ${game.totalQuestions > 0 ? Math.round((game.correctAnswers / game.totalQuestions) * 100) : 0}% ` +
    `ב-${game.totalQuestions} שאלות.\n` +
    `בואו תנסו גם! 🎮`;
  
  if (navigator.share) {
    navigator.share({
      title: 'הקופה הקטנה פרו - תוצאות המשחק',
      text: text,
      url: window.location.href
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('התוצאות הועתקו ללוח!', 'success');
    }).catch(() => {
      showNotification('שגיאה בהעתקה', 'error');
    });
  }
}

function checkAchievements() {
  // Achievement checking logic would go here
  // This is a simplified version
  const newAchievements = [];
  
  if (game.streak >= 5 && !game.achievements.includes('streak_5')) {
    newAchievements.push('streak_5');
    showNotification('🏆 הישג חדש: רצף של 5!', 'success');
  }
  
  if (game.totalQuestions >= 10 && !game.achievements.includes('beginner')) {
    newAchievements.push('beginner');
    showNotification('🌟 הישג חדש: מתחיל!', 'success');
  }
  
  game.achievements.push(...newAchievements);
}

// Initialize the game
async function initializeGame() {
  console.log('Initializing Cash Register Pro Game...');
  
  // Load saved data
  game.loadFromStorage();
  
  // Set initial theme
  document.body.dataset.theme = game.isDarkMode ? 'dark' : 'light';
  elements.darkToggle.textContent = game.isDarkMode ? '☀️ מצב יום' : '🌓 מצב לילה';
  
  // Load game data
  await loadGameData();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initialize game state
  updateDifficultySettings();
  updateProductDisplay();
  updateScoreDisplay();
  
  console.log('Game initialized successfully!');
}

// Start the game when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGame);
} else {
  initializeGame();
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(0); opacity: 1; }
    to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;
document.head.appendChild(style);
