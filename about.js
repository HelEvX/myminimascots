document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.timeline-scroll-wrapper');
    const popup = wrapper.querySelector('.timeline-popup');
    const popupImg = popup.querySelector('img');
    const popupText = popup.querySelector('p');
    const items = wrapper.querySelectorAll('.timeline-item');

    // Helper: Move popup to correct parent and position
    function positionPopup(item) {
        if (window.innerWidth <= 600) {
            // Vertical timeline: insert popup inside the item
            item.appendChild(popup);
            popup.style.position = 'static';
            popup.style.left = '';
            popup.style.bottom = '';
            popup.style.transform = '';
        } else {
            // Horizontal timeline: popup is absolutely positioned in wrapper
            wrapper.appendChild(popup);
            popup.style.position = 'absolute';
            popup.style.bottom = '100%';

            const itemRect = item.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            let offsetLeft = itemRect.left - wrapperRect.left + itemRect.width / 2;

            popup.style.left = `${offsetLeft}px`;
            popup.style.transform = 'translateX(-50%)';
        }
    }

    function showPopup(item) {
        const imgSrc = item.getAttribute('data-img');
        const label = item.querySelector('.timeline-label').textContent;
        const year = item.querySelector('.timeline-year').textContent;

        popupImg.src = imgSrc;
        popupImg.alt = `${year} mascot`;
        popupText.textContent = label;

        positionPopup(item);
        popup.classList.add('visible');
    }

    function hidePopup() {
        popup.classList.remove('visible');
        // On mobile, move popup back to wrapper to prevent DOM clutter
        if (window.innerWidth <= 600) {
            wrapper.appendChild(popup);
        }
    }

    items.forEach(item => {
        item.addEventListener('mouseenter', () => showPopup(item));
        item.addEventListener('focus', () => showPopup(item));
        item.addEventListener('mouseleave', hidePopup);
        item.addEventListener('blur', hidePopup);
    });

    wrapper.addEventListener('scroll', hidePopup);

    // Optional: Reposition popup on window resize (handles orientation change)
    window.addEventListener('resize', function () {
        // If popup is visible, reposition it for the new layout
        const visibleItem = document.querySelector('.timeline-item:focus, .timeline-item:hover');
        if (popup.classList.contains('visible') && visibleItem) {
            positionPopup(visibleItem);
        } else if (popup.classList.contains('visible')) {
            // If no item is focused/hovered, just move popup back to wrapper
            wrapper.appendChild(popup);
        }
    });
});
