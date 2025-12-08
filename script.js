// Game Variables
let maxValue = 10;
let maxAttempts = 5;
let solution = 0;
let attempts = 0;
let isGameOver = false;
let guessHistory = [];
let bestScore = localStorage.getItem('bestScore') || '-';

// DOM Elements
const maxValueDisplay = document.getElementById('maxValueDisplay');
const maxAttemptsDisplay = document.getElementById('maxAttemptsDisplay');
const attemptsCount = document.getElementById('attemptsCount');
const remainingAttempts = document.getElementById('remainingAttempts');
const bestScoreElement = document.getElementById('bestScore');
const displayNumber = document.getElementById('displayNumber');
const hintText = document.getElementById('hintText');
const guessInput = document.getElementById('guessInput');
const submitBtn = document.getElementById('submitBtn');
const quickButtons = document.getElementById('quickButtons');
const historyList = document.getElementById('historyList');
const messageBox = document.getElementById('messageBox');
const messageTitle = document.getElementById('messageTitle');
const messageText = document.getElementById('messageText');
const closeMessage = document.getElementById('closeMessage');
const hintBtn = document.getElementById('hintBtn');
const restartBtn = document.getElementById('restartBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const maxValueSetting = document.getElementById('maxValueSetting');
const maxAttemptsSetting = document.getElementById('maxAttemptsSetting');
const maxValueLabel = document.getElementById('maxValueLabel');
const maxAttemptsLabel = document.getElementById('maxAttemptsLabel');
const saveSettings = document.getElementById('saveSettings');
const cancelSettings = document.getElementById('cancelSettings');

// Initialize Game
function initGame() {
    // Generate random solution
    solution = Math.floor(Math.random() * maxValue) + 1;
    
    // Reset game state
    attempts = 0;
    isGameOver = false;
    guessHistory = [];
    
    // Update UI
    updateUI();
    createQuickButtons();
    updateHistory();
    
    // Set input attributes
    guessInput.min = 1;
    guessInput.max = maxValue;
    guessInput.placeholder = `Enter number (1-${maxValue})`;
    
    // Enable input and button
    guessInput.disabled = false;
    submitBtn.disabled = false;
    guessInput.focus();
    
    console.log(`[DEV] Solution is: ${solution}`); // For development
}

// Update UI Elements
function updateUI() {
    maxValueDisplay.textContent = maxValue;
    maxAttemptsDisplay.textContent = maxAttempts;
    attemptsCount.textContent = attempts;
    remainingAttempts.textContent = maxAttempts - attempts;
    bestScoreElement.textContent = bestScore;
    displayNumber.textContent = '?';
    hintText.textContent = attempts === 0 ? 'Enter your first guess!' : 'Make your next guess!';
}

// Create Quick Number Buttons
function createQuickButtons() {
    quickButtons.innerHTML = '';
    for (let i = 1; i <= maxValue; i++) {
        const button = document.createElement('button');
        button.className = 'quick-btn';
        button.textContent = i;
        button.dataset.value = i;
        
        // Check if number has been used
        if (guessHistory.some(guess => guess.number === i)) {
            button.classList.add('used');
            button.disabled = true;
        }
        
        button.addEventListener('click', () => {
            if (!button.disabled) {
                guessInput.value = i;
                checkGuess();
            }
        });
        
        quickButtons.appendChild(button);
    }
}

// Check User's Guess
function checkGuess() {
    if (isGameOver) return;
    
    const guess = parseInt(guessInput.value);
    
    // Validate input
    if (isNaN(guess) || guess < 1 || guess > maxValue) {
        showMessage('Invalid Input', `Please enter a number between 1 and ${maxValue}`);
        guessInput.value = '';
        guessInput.focus();
        return;
    }
    
    // Increment attempts
    attempts++;
    
    // Add to history
    const result = guess === solution ? 'correct' : guess > solution ? 'high' : 'low';
    guessHistory.push({ number: guess, result: result });
    
    // Update UI
    updateUI();
    updateHistory();
    createQuickButtons();
    
    // Check game state
    if (guess === solution) {
        gameWon();
    } else if (attempts >= maxAttempts) {
        gameLost();
    } else {
        // Provide hint
        const hint = guess > solution ? 'Too high!' : 'Too low!';
        hintText.textContent = `${hint} ${maxAttempts - attempts} attempt(s) left.`;
        hintText.style.color = guess > solution ? '#ef476f' : '#ffd166';
        
        // Animate the number display
        displayNumber.textContent = '?';
        displayNumber.parentElement.classList.add('pulse');
        setTimeout(() => {
            displayNumber.parentElement.classList.remove('pulse');
        }, 500);
    }
    
    // Clear input and focus
    guessInput.value = '';
    guessInput.focus();
}

// Game Won
function gameWon() {
    isGameOver = true;
    displayNumber.textContent = solution;
    displayNumber.parentElement.classList.add('celebrate');
    
    // Calculate score
    const score = maxAttempts - attempts + 1;
    hintText.textContent = `🎉 Perfect! You found it in ${attempts} attempt(s)!`;
    hintText.style.color = '#06d6a0';
    
    // Update best score
    if (bestScore === '-' || score > parseInt(bestScore)) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestScoreElement.textContent = bestScore;
        showMessage('New Best Score!', `You scored ${score} points! That's a new record!`);
    } else {
        showMessage('Congratulations!', `You guessed the number ${solution} in ${attempts} attempt(s)!`);
    }
    
    // Disable input
    guessInput.disabled = true;
    submitBtn.disabled = true;
    
    // Mark correct button
    const correctButton = document.querySelector(`.quick-btn[data-value="${solution}"]`);
    if (correctButton) {
        correctButton.classList.add('correct');
    }
}

// Game Lost
function gameLost() {
    isGameOver = true;
    displayNumber.textContent = solution;
    displayNumber.parentElement.style.background = 'linear-gradient(135deg, #ef476f, #ff9e00)';
    
    hintText.textContent = `Game Over! The number was ${solution}`;
    hintText.style.color = '#ef476f';
    
    showMessage('Game Over', `You've used all ${maxAttempts} attempts. The number was ${solution}.`);
    
    // Disable input
    guessInput.disabled = true;
    submitBtn.disabled = true;
}

// Update Guess History
function updateHistory() {
    historyList.innerHTML = '';
    
    guessHistory.forEach(guess => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const guessNumber = document.createElement('span');
        guessNumber.className = 'guess-number';
        guessNumber.textContent = guess.number;
        
        const guessResult = document.createElement('span');
        guessResult.className = 'guess-result';
        
        const icon = document.createElement('i');
        if (guess.result === 'correct') {
            icon.className = 'fas fa-check';
            guessResult.classList.add('result-correct');
            guessResult.textContent = 'Correct!';
        } else if (guess.result === 'high') {
            icon.className = 'fas fa-arrow-up';
            guessResult.classList.add('result-high');
            guessResult.textContent = 'Too High';
        } else {
            icon.className = 'fas fa-arrow-down';
            guessResult.classList.add('result-low');
            guessResult.textContent = 'Too Low';
        }
        
        guessResult.prepend(icon);
        historyItem.appendChild(guessNumber);
        historyItem.appendChild(guessResult);
        historyList.prepend(historyItem);
    });
}

// Show Message Modal
function showMessage(title, text) {
    messageTitle.textContent = title;
    messageText.textContent = text;
    messageBox.style.display = 'flex';
}

// Event Listeners
submitBtn.addEventListener('click', checkGuess);

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

closeMessage.addEventListener('click', () => {
    messageBox.style.display = 'none';
});

hintBtn.addEventListener('click', () => {
    if (attempts === 0 || isGameOver) return;
    
    // Calculate a helpful hint
    const lastGuess = guessHistory[guessHistory.length - 1];
    let hint = '';
    
    if (lastGuess.result === 'high') {
        hint = `Try a number lower than ${lastGuess.number}`;
    } else {
        hint = `Try a number higher than ${lastGuess.number}`;
    }
    
    hintText.textContent = `💡 Hint: ${hint}`;
    hintText.style.color = '#90e0ef';
});

restartBtn.addEventListener('click', initGame);

settingsBtn.addEventListener('click', () => {
    // Load current settings
    maxValueSetting.value = maxValue;
    maxAttemptsSetting.value = maxAttempts;
    maxValueLabel.textContent = maxValue;
    maxAttemptsLabel.textContent = maxAttempts;
    
    settingsModal.style.display = 'flex';
});

maxValueSetting.addEventListener('input', () => {
    maxValueLabel.textContent = maxValueSetting.value;
});

maxAttemptsSetting.addEventListener('input', () => {
    maxAttemptsLabel.textContent = maxAttemptsSetting.value;
});

saveSettings.addEventListener('click', () => {
    maxValue = parseInt(maxValueSetting.value);
    maxAttempts = parseInt(maxAttemptsSetting.value);
    
    settingsModal.style.display = 'none';
    initGame();
});

cancelSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === messageBox) {
        messageBox.style.display = 'none';
    }
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', () => {
    bestScoreElement.textContent = bestScore;
    initGame();
});