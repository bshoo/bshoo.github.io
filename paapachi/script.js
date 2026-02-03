/* ============================================
   CONFIGURATION
   ============================================ */

// Target countdown date - CHANGE YEAR HERE
const TARGET_YEAR = 2026;
const TARGET_MONTH = 2; // February (1-12)
const TARGET_DAY = 24;
const TARGET_HOUR = 20; // 8 PM in 24-hour format
const TARGET_MINUTE = 45;

// Background image configuration
const IMAGE_FOLDER = 'images/';
const FALLBACK_IMAGE = 'images/fallback.jpg';

// Reference date for deterministic image selection
// This ensures the same image appears on the same day
const REFERENCE_DATE = new Date('2026-02-03'); // Today's date

/* ============================================
   STATE MANAGEMENT
   ============================================ */

let countdownInterval = null;
let currentBackgroundIndex = -1;
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
            seconds: 0
        };
    }
    
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    return {
        total: diff,
        days,
        hours,
        minutes,
        seconds
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
        
        messageEl.textContent = "I'm here.";
        containerEl.classList.add('finished');
        
        return;
    }
    
    // Update countdown values with padding
    daysEl.textContent = String(time.days).padStart(2, '0');
    hoursEl.textContent = String(time.hours).padStart(2, '0');
    minutesEl.textContent = String(time.minutes).padStart(2, '0');
    
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
 * Get the number of days since the reference date
 * This creates a deterministic image selection based on the current date
 */
function getDayOffset() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reference = new Date(
        REFERENCE_DATE.getFullYear(),
        REFERENCE_DATE.getMonth(),
        REFERENCE_DATE.getDate()
    );
    
    const diffTime = today - reference;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

/**
 * Generate image filename based on day offset
 * Format: day-0.jpg, day-1.jpg, day-2.jpg, etc.
 */
function getImageFilename(offset) {
    return `${IMAGE_FOLDER}day-${offset}.jpg`;
}

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
 * Set background image with fallback
 */
async function setBackgroundImage(imageUrl) {
    const currentLayer = document.getElementById('background-current');
    const nextLayer = document.getElementById('background-next');
    
    try {
        // Try to load the image
        await loadImage(imageUrl);
        
        // If successful, apply it to the next layer
        nextLayer.style.backgroundImage = `url('${imageUrl}')`;
        
        // Fade transition
        setTimeout(() => {
            nextLayer.style.opacity = '1';
            currentLayer.style.opacity = '0';
            
            // After transition, swap layers
            setTimeout(() => {
                currentLayer.style.backgroundImage = nextLayer.style.backgroundImage;
                currentLayer.style.opacity = '1';
                nextLayer.style.opacity = '0';
            }, 2000);
        }, 50);
        
    } catch (error) {
        console.warn(`Image not found: ${imageUrl}, using fallback`);
        
        // Try fallback image
        try {
            await loadImage(FALLBACK_IMAGE);
            nextLayer.style.backgroundImage = `url('${FALLBACK_IMAGE}')`;
            
            setTimeout(() => {
                nextLayer.style.opacity = '1';
                currentLayer.style.opacity = '0';
                
                setTimeout(() => {
                    currentLayer.style.backgroundImage = nextLayer.style.backgroundImage;
                    currentLayer.style.opacity = '1';
                    nextLayer.style.opacity = '0';
                }, 2000);
            }, 50);
            
        } catch (fallbackError) {
            console.error('Fallback image also failed to load');
        }
    }
}

/**
 * Update background based on current date
 */
function updateBackground() {
    const offset = getDayOffset();
    
    // Only update if this is a new day
    if (offset !== currentBackgroundIndex) {
        currentBackgroundIndex = offset;
        const imageUrl = getImageFilename(offset);
        setBackgroundImage(imageUrl);
    }
}

/**
 * Calculate milliseconds until next midnight
 */
function msUntilMidnight() {
    const now = new Date();
    const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
    );
    return tomorrow - now;
}

/**
 * Schedule background update at midnight
 */
function scheduleMidnightUpdate() {
    const msUntil = msUntilMidnight();
    
    setTimeout(() => {
        updateBackground();
        // Schedule next update (24 hours from now)
        scheduleMidnightUpdate();
    }, msUntil);
}

/**
 * Initialize background image system
 */
function initBackground() {
    updateBackground();
    scheduleMidnightUpdate();
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
