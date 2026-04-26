/* ============================================
   CONFIGURATION
   ============================================ */

// Image base names — tries jpg, jpeg, png, webp in order
const IMAGES = ['b1', 'b2', 'b3', 'b4'];
const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];
const IMAGE_FOLDER = 'images/';

/* ============================================
   IMAGE LOADING — tries multiple formats
   ============================================ */

function loadImageWithFallback(baseName, elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let formatIndex = 0;

    function tryNext() {
        if (formatIndex >= IMAGE_FORMATS.length) {
            console.warn(`Could not load any format for: ${baseName}`);
            return;
        }

        const src = `${IMAGE_FOLDER}${baseName}.${IMAGE_FORMATS[formatIndex]}`;
        const img = new Image();

        img.onload = () => {
            el.style.backgroundImage = `url('${src}')`;
            console.log(`✓ Loaded: ${src}`);
        };

        img.onerror = () => {
            console.log(`✗ Failed: ${src}`);
            formatIndex++;
            tryNext();
        };

        img.src = src;
    }

    tryNext();
}

function initImages() {
    IMAGES.forEach((name, i) => {
        loadImageWithFallback(name, `photo-${i + 1}`);
    });
}

/* ============================================
   CONFETTI
   ============================================ */

const canvas  = document.getElementById('confetti-canvas');
const ctx     = canvas.getContext('2d');

let pieces    = [];
let animFrame = null;
let running   = false;

// Palette — warm, celebratory, not garish
const COLORS = [
    '#f9e4b7', '#f7c59f', '#e8a598', '#c9ada7',
    '#d4b8c7', '#b5ead7', '#ffdac1', '#e2f0cb',
    '#ffffff', '#ffeaa7'
];

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

function createPiece() {
    return {
        x:       randomBetween(0, canvas.width),
        y:       randomBetween(-40, -10),
        w:       randomBetween(6, 12),
        h:       randomBetween(10, 18),
        color:   COLORS[Math.floor(Math.random() * COLORS.length)],
        angle:   randomBetween(0, Math.PI * 2),
        spin:    randomBetween(-0.08, 0.08),
        vx:      randomBetween(-1.2, 1.2),
        vy:      randomBetween(2.5, 5),
        opacity: randomBetween(0.75, 1),
    };
}

function spawnBurst(count) {
    for (let i = 0; i < count; i++) {
        pieces.push(createPiece());
    }
}

function drawPieces() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    });
}

function updatePieces() {
    pieces.forEach(p => {
        p.x     += p.vx;
        p.y     += p.vy;
        p.angle += p.spin;
        p.vy    += 0.06; // gentle gravity
        p.opacity -= 0.003;
    });

    // Remove pieces that have fallen off screen or faded out
    pieces = pieces.filter(p => p.y < canvas.height + 30 && p.opacity > 0);
}

function animate() {
    if (!running) return;
    drawPieces();
    updatePieces();
    animFrame = requestAnimationFrame(animate);
}

function stopConfetti() {
    running = false;
    cancelAnimationFrame(animFrame);
    // Fade out the remaining pieces over ~1s then clear
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces = [];
    }, 1200);
}

function launchConfetti() {
    resizeCanvas();
    running = true;

    // Initial big burst
    spawnBurst(180);

    // A few follow-up waves to keep it lively
    setTimeout(() => spawnBurst(120), 250);
    setTimeout(() => spawnBurst(80),  600);

    animate();

    // Stop spawning after ~2.5s, let pieces fall naturally
    setTimeout(stopConfetti, 2500);
}

/* ============================================
   REVEAL SEQUENCE
   ============================================ */

function revealBirthdayBox() {
    const box = document.getElementById('birthday-container');
    box.classList.add('visible');
}

function init() {
    initImages();

    // 1s after load: confetti + reveal birthday box together
    setTimeout(() => {
        launchConfetti();
        revealBirthdayBox();
    }, 1000);
}

/* ============================================
   BOOT
   ============================================ */
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener('DOMContentLoaded', init);
