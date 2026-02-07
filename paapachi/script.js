/* ============================================
   CONFIGURATION
   ============================================ */

// Target countdown date - CHANGE YEAR HERE
const TARGET_YEAR = 2026;
const TARGET_MONTH = 2; // February (1-12)
const TARGET_DAY = 24;
const TARGET_HOUR = 20; // 8 PM in 24-hour format
const TARGET_MINUTE = 45;

// Background image configuration - only uses fallback now
const FALLBACK_IMAGE = 'images/fallback.jpg';

/* ============================================
   STATE MANAGEMENT
   ============================================ */

let countdownInterval = null;
let isCountdownFinished = false;

/* ============================================
   COUNTDOWN LOGIC
   ============================================ */

/**
 * Calculate the target date in the user's local timezone
 */
function getTargetDate() {
    return new Date(
        TARGET_YEAR,
        TARGET_MONTH - 1, // JavaScript months are 0-indexed
        TARGET_DAY,
        TARGET_HOUR,
        TARGET_MINUTE,
        0,
        0
    );
}

/**
 * Calculate the number of Sundays between now and target date
 */
function countSundaysUntilTarget() {
    const now = new Date();
    const target = getTargetDate();
    
    let sundayCount = 0;
    let currentDate = new Date(now);
    currentDate.setHours(0, 0, 0, 0);
    
    while (currentDate < target) {
        if (currentDate.getDay() === 0) { // Sunday is 0
            sundayCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return sundayCount;
}

/**
 * Calculate time remaining until target date
 */
function calculateTimeRemaining() {
    const now = new Date();
    const target = getTargetDate();
    const diff = target - now;
    
    if (diff <= 0) {
        return {
            total: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            weekdays: 0
        };
    }
    
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Calculate weekdays (days minus Sundays)
    const sundays = countSundaysUntilTarget();
    const weekdays = days - sundays;
    
    return {
        total: diff,
        days,
        hours,
        minutes,
        seconds,
        weekdays
    };
}

/**
 * Update the countdown display
 */
function updateCountdown() {
    const time = calculateTimeRemaining();
    
    // Get DOM elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const weekdaysEl = document.getElementById('weekdays-remaining');
    const messageEl = document.getElementById('message');
    const containerEl = document.getElementById('countdown-container');
    
    // Check if countdown has finished
    if (time.total <= 0 && !isCountdownFinished) {
        isCountdownFinished = true;
        clearInterval(countdownInterval);
        
        // Update display to show completion
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        weekdaysEl.textContent = '0';
        
        messageEl.textContent = "I'm here.";
        containerEl.classList.add('finished');
        
        return;
    }
    
    // Update countdown values with padding
    daysEl.textContent = String(time.days).padStart(2, '0');
    hoursEl.textContent = String(time.hours).padStart(2, '0');
    minutesEl.textContent = String(time.minutes).padStart(2, '0');
    weekdaysEl.textContent = time.weekdays;
    
    // Update seconds with animation
    const newSeconds = String(time.seconds).padStart(2, '0');
    if (secondsEl.textContent !== newSeconds) {
        secondsEl.textContent = newSeconds;
        secondsEl.classList.remove('pulse');
        // Trigger reflow to restart animation
        void secondsEl.offsetWidth;
        secondsEl.classList.add('pulse');
    }
}

/**
 * Initialize and start the countdown
 */
function initCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

/* ============================================
   BACKGROUND IMAGE SYSTEM
   ============================================ */

/**
 * Load an image and return a promise
 */
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

/**
 * Set static background image (fallback only)
 */
async function setBackgroundImage() {
    const currentLayer = document.getElementById('background-current');
    
    // Try multiple formats for the fallback image
    const formats = ['jpg', 'jpeg', 'png', 'webp'];
    const basePath = 'images/fallback';
    
    for (const format of formats) {
        const imagePath = `${basePath}.${format}`;
        try {
            await loadImage(imagePath);
            currentLayer.style.backgroundImage = `url('${imagePath}')`;
            console.log(`✓ Background image loaded: ${imagePath}`);
            return;
        } catch (error) {
            console.log(`✗ Failed to load: ${imagePath}`);
        }
    }
    
    console.error('Failed to load background image in any format');
}

/**
 * Initialize background image system
 */
function initBackground() {
    setBackgroundImage();
}

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    initCountdown();
});

/**
 * Handle page visibility changes
 * Re-sync countdown when user returns to the tab
 */
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !isCountdownFinished) {
        updateCountdown();
    }
});
