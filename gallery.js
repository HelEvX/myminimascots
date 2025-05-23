class FeaturedCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 3;
        this.grid = document.getElementById('featuredGrid');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dots = document.querySelectorAll('.pagination-dot');
        this.isTransitioning = false;

        this.init();
    }

    init() {
        this.createInfiniteLoop();
        this.setupEventListeners();
        // this.startAutoPlay();
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
        this.grid.style.transform = `translateX(-100%)`;
        this.grid.style.transition = 'none';
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index + 1));
        });

        // Handle transition end for seamless loop
        this.grid.addEventListener('transitionend', () => {
            this.handleTransitionEnd();
        });
    }

    goToSlide(slideIndex, withTransition = true) {
        if (this.isTransitioning && withTransition) return;

        this.isTransitioning = withTransition; // Only block if animating
        this.currentSlide = slideIndex;

        this.grid.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
        const translateX = -slideIndex * 100;
        this.grid.style.transform = `translateX(${translateX}%)`;

        // Update dots
        const realSlideIndex = this.getRealSlideIndex(slideIndex);
        this.updateDots(realSlideIndex);
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

    getRealSlideIndex(slideIndex) {
        if (slideIndex === 0) return this.totalSlides - 1; // Last slide
        if (slideIndex === this.totalSlides + 1) return 0; // First slide
        return slideIndex - 1; // Normal slides (adjust for clone offset)
    }

    updateDots(realSlideIndex) {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === realSlideIndex);
        });
    }

    startAutoPlay() {
        // Very slow autoplay - 12 seconds between slides
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 12000);

        const carousel = document.querySelector('.featured-carousel');
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

    // FEATURED GALLERY

    new FeaturedCarousel();

    // MAIN GALLERY GRID

    const filterBtns = document.querySelectorAll('.nav-btn, .filter-tag');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active states
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category').includes(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Load more functionality (placeholder)
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            // Add logic to load more images
            console.log('Loading more images...');
        });
    }

});