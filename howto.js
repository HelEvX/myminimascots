document.addEventListener('DOMContentLoaded', function () {
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
