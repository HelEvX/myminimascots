class FinishedCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 15; // number of slides
        this.grid = document.getElementById('finishedGrid');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.isTransitioning = false;
        this.slideWidth = 440; // Width of each slide (400px image + 40px padding)

        this.init();
    }

    init() {
        this.createInfiniteLoop();
        this.setupEventListeners();
        this.startAutoPlay();
        this.addTouchSupport();
    }

    createInfiniteLoop() {
        const slides = Array.from(this.grid.children);

        // Clone last slide and prepend to beginning
        const firstClone = slides[slides.length - 1].cloneNode(true);
        firstClone.classList.add('clone');
        this.grid.insertBefore(firstClone, slides[0]);

        // Clone first slide and append to end
        const lastClone = slides[0].cloneNode(true);
        lastClone.classList.add('clone');
        this.grid.appendChild(lastClone);

        // Start at the first real slide (index 1 now because of prepended clone)
        this.currentSlide = 1;

        // To center: move left by (slideIndex * slideWidth) - (carousel center - slide center)
        const carouselCenter = 360; // 720px / 2
        const slideCenter = 220; // 440px / 2
        const centerOffset = carouselCenter - slideCenter; // 140px

        const initialTransform = (this.currentSlide * this.slideWidth) - centerOffset;
        this.grid.style.transform = `translateX(-${initialTransform}px)`;
        this.grid.style.transition = 'none';
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Handle transition end for seamless loop
        this.grid.addEventListener('transitionend', () => {
            this.handleTransitionEnd();
        });
    }

    goToSlide(slideIndex, withTransition = true) {
        if (this.isTransitioning && withTransition) return;

        this.isTransitioning = withTransition;
        this.currentSlide = slideIndex;

        this.grid.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';

        // Calculate transform to center the target slide
        const carouselCenter = 360; // 720px / 2
        const slideCenter = 220; // 440px / 2
        const centerOffset = carouselCenter - slideCenter; // 140px

        const translateX = (slideIndex * this.slideWidth) - centerOffset;
        this.grid.style.transform = `translateX(-${translateX}px)`;
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.goToSlide(this.currentSlide + 1);
    }

    previousSlide() {
        if (this.isTransitioning) return;
        this.goToSlide(this.currentSlide - 1);
    }

    handleTransitionEnd() {
        // If on a clone, jump to the real slide instantly (no animation)
        if (this.currentSlide === 0) {
            this.goToSlide(this.totalSlides, false);
        } else if (this.currentSlide === this.totalSlides + 1) {
            this.goToSlide(1, false);
        }
        this.isTransitioning = false;
    }

    startAutoPlay() {
        // Slow autoplay - 12 seconds between slides
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 12000);

        const carousel = document.querySelector('.finished-carousel');
        carousel.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }

    addTouchSupport() {
        let startX = 0;
        let isDragging = false;

        this.grid.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.grid.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        this.grid.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', function () {

    // Initialize the Finished carousel
    new FinishedCarousel();

    // Process Steps
    const stepTiles = document.querySelectorAll('.step-tile');
    const stepDetails = document.querySelectorAll('.step-detail');

    stepTiles.forEach(tile => {
        tile.addEventListener('click', function () {
            const step = this.getAttribute('data-step');
            // Remove active from all
            stepTiles.forEach(t => t.classList.remove('active'));
            stepDetails.forEach(d => d.classList.remove('active'));
            // Add active to selected
            this.classList.add('active');
            document.querySelector('.step-detail[data-step="' + step + '"]').classList.add('active');
        });
    });
});
