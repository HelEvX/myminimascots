const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.main-nav ul');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function () {
    const sections = [
        'manifesto',
        'featured',
        'testimonials',
        'blog',
        'newsletter'
    ];

    let currentStep = 0;

    const scrollBtn = document.getElementById('scroll-nav-btn');
    const scrollArrow = document.getElementById('scroll-arrow');
    const hero = document.getElementById('hero');
    const heroBtn = document.getElementById('hero-cuddle-btn');

    function toggleScrollBtn() {
        const heroBottom = hero.getBoundingClientRect().bottom;
        if (heroBottom < 50) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
            currentStep = 0; // reset if user scrolls back up
            scrollArrow.style.transform = 'rotate(0deg)';
            scrollBtn.setAttribute('aria-label', 'Scroll down');
        }
    }

    if (heroBtn) {
        heroBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const firstSection = document.getElementById(sections[0]);
            if (firstSection) {
                scrollBtn.disabled = true;
                scrollBtn.style.display = 'flex';

                firstSection.scrollIntoView({ behavior: 'smooth' });

                setTimeout(() => {
                    scrollBtn.disabled = false;
                    currentStep = 1;
                }, 800);
            }
        });
    }

    scrollBtn.addEventListener('click', function () {
        if (currentStep < sections.length) {
            const nextSection = document.getElementById(sections[currentStep]);
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
                currentStep++;
            }
            if (currentStep === sections.length) {
                scrollArrow.style.transform = 'rotate(180deg)';
                scrollBtn.setAttribute('aria-label', 'Scroll to top');
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            currentStep = 0;
            scrollArrow.style.transform = 'rotate(0deg)';
            scrollBtn.setAttribute('aria-label', 'Scroll down');
        }
    });

    window.addEventListener('scroll', toggleScrollBtn);
    toggleScrollBtn();

});

// GALLERY SCROLL

document.addEventListener('DOMContentLoaded', function () {
    const scrollContainer = document.getElementById('gallery-scroll');
    const leftArrow = document.querySelector('.gallery-arrow-left');
    const rightArrow = document.querySelector('.gallery-arrow-right');
    const scrollBar = document.querySelector('.gallery-scroll-bar');
    const scrollThumb = document.querySelector('.gallery-scroll-thumb');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Helper: check if scroll is needed
    function isScrollable() {
        return scrollContainer.scrollWidth > scrollContainer.clientWidth + 1;
    }

    // Center the scroll position if scrollable and not on touch
    function centerScroll() {
        if (isScrollable() && !isTouch) {
            scrollContainer.scrollLeft = (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2;
        }
    }

    // Update arrow visibility
    function updateArrows() {
        if (isTouch || !isScrollable()) {
            leftArrow.style.display = 'none';
            rightArrow.style.display = 'none';
            return;
        }
        const atStart = scrollContainer.scrollLeft < 5;
        const atEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth > scrollContainer.scrollWidth - 5;
        leftArrow.style.display = atStart ? 'none' : 'flex';
        rightArrow.style.display = atEnd ? 'none' : 'flex';
    }

    // Scroll by one item width
    function scrollByItem(dir) {
        const item = scrollContainer.querySelector('.gallery-item');
        if (!item) return;
        const gap = parseInt(getComputedStyle(scrollContainer).gap || 32, 10);
        scrollContainer.scrollBy({ left: dir * (item.offsetWidth + gap), behavior: 'smooth' });
    }

    // Scroll indicator logic
    function updateIndicator() {
        if (!isScrollable()) {
            scrollBar.style.opacity = 0;
            return;
        }
        scrollBar.style.opacity = 1;
        const ratio = scrollContainer.clientWidth / scrollContainer.scrollWidth;
        const thumbWidth = Math.max(scrollBar.offsetWidth * ratio, 40);
        const maxLeft = scrollBar.offsetWidth - thumbWidth;
        const left = (scrollContainer.scrollLeft / (scrollContainer.scrollWidth - scrollContainer.clientWidth)) * maxLeft;
        scrollThumb.style.width = thumbWidth + 'px';
        scrollThumb.style.left = (isNaN(left) ? 0 : left) + 'px';
    }

    // Event listeners
    leftArrow.addEventListener('click', () => scrollByItem(-1));
    rightArrow.addEventListener('click', () => scrollByItem(1));
    scrollContainer.addEventListener('scroll', () => {
        updateArrows();
        updateIndicator();
    });
    window.addEventListener('resize', () => {
        centerScroll();
        updateArrows();
        updateIndicator();
    });

    // Initial setup
    setTimeout(() => {
        centerScroll();
        updateArrows();
        updateIndicator();
    }, 150);

    // Always show indicator on touch devices
    if (isTouch) scrollBar.style.opacity = 1;
});


