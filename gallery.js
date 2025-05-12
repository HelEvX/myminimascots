document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('masonryGrid');
    if (!grid) return;

    function setRowSpan(item, content, rowHeight, rowGap) {
        // Ensure height is calculated after rendering
        setTimeout(() => {
            const itemHeight = content.offsetHeight;
            const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
            item.style.gridRowEnd = `span ${rowSpan}`;
        }, 10); // 10ms delay to ensure correct height
    }

    function resizeAllGridItems() {
        const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('gap'));
        Array.from(grid.children).forEach(item => {
            const content = item.querySelector('img, video');
            if (content) {
                // For images
                if (content.tagName === 'IMG') {
                    if (content.complete) {
                        setRowSpan(item, content, rowHeight, rowGap);
                    } else {
                        content.onload = () => setRowSpan(item, content, rowHeight, rowGap);
                    }
                }
                // For videos
                if (content.tagName === 'VIDEO') {
                    if (content.readyState > 0) {
                        setRowSpan(item, content, rowHeight, rowGap);
                    } else {
                        content.onloadedmetadata = () => setRowSpan(item, content, rowHeight, rowGap);
                    }
                }
            }
        });
    }

    window.addEventListener('resize', resizeAllGridItems);
    window.addEventListener('load', resizeAllGridItems);
    resizeAllGridItems();
});