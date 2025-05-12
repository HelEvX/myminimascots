document.addEventListener('DOMContentLoaded', function () {
    const faqButtons = document.querySelectorAll('.faq-question');

    faqButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            // Collapse all
            faqButtons.forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                document.getElementById(b.getAttribute('aria-controls')).hidden = true;
                document.getElementById(b.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');
            });
            // Expand clicked one if it wasn't already open
            if (!expanded) {
                btn.setAttribute('aria-expanded', 'true');
                const answer = document.getElementById(btn.getAttribute('aria-controls'));
                answer.hidden = false;
                answer.setAttribute('aria-hidden', 'false');
            }
        });
    });
});
