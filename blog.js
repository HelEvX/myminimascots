// Social sharing functions
function shareOnPinterest() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Behind the Scenes: How a Mascot is Born - My Mini Mascots');
    const image = encodeURIComponent(document.querySelector('.hero-image').src);
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&description=${text}&media=${image}`, '_blank', 'width=800,height=600');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=800,height=600');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Behind the Scenes: How a Mascot is Born - My Mini Mascots');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=800,height=600');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Newsletter form submission
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email) {
        alert('Thank you for subscribing! (This is a demo - integrate with your email service)');
        this.reset();
    }
});

// Add reading progress indicator
function updateReadingProgress() {
    const article = document.querySelector('.blog-content');
    const scrollTop = window.scrollY;
    const docHeight = article.offsetHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight);
    const scrollPercentRounded = Math.round(scrollPercent * 100);

    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.reading-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 0%;
                    height: 4px;
                    background: var(--primary-accent);
                    z-index: 1000;
                    transition: width 0.1s ease;
                `;
        document.body.appendChild(progressBar);
    }

    progressBar.style.width = Math.min(scrollPercentRounded, 100) + '%';
}

// Update progress on scroll
window.addEventListener('scroll', updateReadingProgress);

// Initialize progress on load
updateReadingProgress();