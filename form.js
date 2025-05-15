document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('mascotRequestForm');

    // Only select direct children .form-step of the form (ignores wrappers)
    const steps = Array.from(form.querySelectorAll(':scope > .form-step'));

    // Only select direct children .progress-step of .progress-bar
    const progressBar = document.querySelector('.progress-bar');
    const progressBarSteps = progressBar ? progressBar.querySelectorAll(':scope > .progress-step') : [];

    let currentStep = 0;

    function showStep(index) {
        steps.forEach((step, i) => step.classList.toggle('active', i === index));
        progressBarSteps.forEach((step, i) => step.classList.toggle('active', i === index));
    }

    form.addEventListener('click', (e) => {
        if (e.target.classList.contains('next')) {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);

                // Check if the NEW step (after showStep) contains the summary
                if (steps[currentStep]?.querySelector('#summary')) {
                    populateSummary();
                }
            }
        } else if (e.target.classList.contains('prev')) {
            currentStep--;
            showStep(currentStep);
        }
    });

    form.addEventListener('submit', (e) => {
        // Show loading message
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.style.display = 'block';
        }
        // The form will submit normally, no preventDefault()
    });

    function validateStep(stepIndex) {
        // Only validate inputs/selects/textareas inside the current step
        const inputs = steps[stepIndex].querySelectorAll('input, textarea, select');
        let valid = true;
        inputs.forEach((input) => {
            if (!input.checkValidity()) {
                input.classList.add('error');
                valid = false;
            } else {
                input.classList.remove('error');
            }
        });
        return valid;
    }

    showStep(currentStep);

    // Colorpicker
    const colorInput = document.getElementById('singleColorInput');
    const previews = document.querySelectorAll('.color-preview');
    const resetButton = document.getElementById('resetColors');
    const confirmButton = document.getElementById('confirmColor');

    let selectedColors = [];

    function updatePreviews() {
        previews.forEach((preview, i) => {
            if (selectedColors[i]) {
                preview.style.background = selectedColors[i];
                preview.classList.remove('empty');
            } else {
                preview.style.background = 'transparent';
                preview.classList.add('empty');
            }
        });
        // Disable confirm if 5 colors are chosen or duplicate
        confirmButton.disabled = selectedColors.length >= 5 || selectedColors.includes(colorInput.value);
    }

    // Add color only when confirm button is clicked
    confirmButton.addEventListener('click', () => {
        if (
            selectedColors.length < 5 &&
            !selectedColors.includes(colorInput.value)
        ) {
            selectedColors.push(colorInput.value);
            updatePreviews();
        }
    });

    // Reset all colors
    resetButton.addEventListener('click', () => {
        selectedColors = [];
        updatePreviews();
    });

    // Update confirm button state on color change
    colorInput.addEventListener('input', updatePreviews);

    // Initialise
    updatePreviews();

    /////////////////////

    // File Size Limit Validation
    const fileInput = document.querySelector('input[type="file"][name="files"]');
    const maxFileSize = 5 * 1024 * 1024; // 5 MB size limit

    if (fileInput) {
        fileInput.addEventListener('change', function (event) {
            const files = event.target.files;
            let fileTooLarge = false;

            for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxFileSize) {
                    fileTooLarge = true;
                    break;
                }
            }

            if (fileTooLarge) {
                alert('File size exceeds the maximum allowed size of 5MB. Please upload a smaller file.');
                fileInput.value = ""; // Clear the input field
            }
        });
    }

    // Gift Toggle Logic

    const deadlineToggle = document.getElementById('toggle-deadline');
    const deadlineContainer = document.getElementById('deadline-container');

    deadlineToggle.addEventListener('change', function () {
        deadlineContainer.style.display = this.checked ? 'block' : 'none';
    });

    const giftToggle = document.getElementById('toggle-gift');
    const giftNote = document.getElementById('gift-note');

    giftToggle.addEventListener('change', function () {
        giftNote.style.display = this.checked ? 'block' : 'none';
    });

    // Price Estimate Logic
    const sizeRadios = form.querySelectorAll('input[name="mascot_size"]');
    const clothing = form.querySelector('input[name="addon_clothing"]');
    const hair = form.querySelector('input[name="addon_hair"]');
    const props = form.querySelector('input[name="addon_props"]');
    const stand = form.querySelector('select[name="display_stand"]');
    const priceOutput = document.querySelector('#estimatedPrice');
    const timeOutput = document.querySelector('#estimatedTime');
    const miniNote = document.querySelector('#miniMascotNote');

    const inputsToWatch = [
        ...sizeRadios,
        clothing,
        hair,
        props,
        stand,
    ];

    function calculateEstimate() {
        const selectedSize = form.querySelector('input[name="mascot_size"]:checked');
        const size = selectedSize ? selectedSize.value : 'full';
        let total = 0;
        let weeks = 2;

        // Reset styles
        miniNote.style.display = 'none';

        if (size === 'mini') {
            total = 30;

            // Disable incompatible options
            [clothing, hair, props].forEach(el => {
                el.checked = false;
                el.disabled = true;
            });

            miniNote.style.display = 'block';
        } else {
            total = 60;

            // Enable add-ons
            [clothing, hair, props].forEach(el => el.disabled = false);

            if (clothing.checked) total += 30;
            if (hair.checked) total += 30;
            if (props.checked) total += 40;
        }

        // Stand costs
        switch (stand.value) {
            case 'basic':
                total += 10;
                break;
            case 'custom':
                total += 20;
                break;
            case 'deluxe':
                total += 50;
                break;
        }

        // Timeline
        if (size !== 'mini') {
            const hasAddons = clothing.checked || hair.checked || props.checked || stand.value !== '';
            weeks = hasAddons ? 4 : 2;
        }

        // Output values
        priceOutput.textContent = `£${total} GBP`;
        timeOutput.textContent = `~${weeks} weeks`;
    }

    // Add event listeners
    inputsToWatch.forEach(input => {
        if (input) {
            input.addEventListener('change', calculateEstimate);
        }
    });

    // Modal Logic

    // 1. Mascot add-ons disabling logic
    const mascotRadios = document.querySelectorAll('input[name="mascot_size"]');
    const extrasGroup = document.querySelector('.mascot-extras-group');
    const extrasInputs = extrasGroup.querySelectorAll('input[type="checkbox"]');
    const minimascotNote = document.getElementById('minimascotNote');

    function updateExtrasState() {
        const selected = document.querySelector('input[name="mascot_size"]:checked').value;
        if (selected === 'mini') {
            extrasGroup.classList.add('disabled');
            extrasGroup.setAttribute('aria-disabled', 'true');
            extrasInputs.forEach(input => input.disabled = true);
            minimascotNote.style.display = 'block';
        } else {
            extrasGroup.classList.remove('disabled');
            extrasGroup.removeAttribute('aria-disabled');
            extrasInputs.forEach(input => input.disabled = false);
            minimascotNote.style.display = 'none';
        }
    }
    mascotRadios.forEach(radio => radio.addEventListener('change', updateExtrasState));
    updateExtrasState(); // run on page load

    // 2. Modal popup logic
    const addMascotBtn = document.getElementById('addmascot');
    let modal = null;

    addMascotBtn.addEventListener('click', function () {
        showMascotModal();
    });

    function showMascotModal() {
        // Create modal if it doesn't exist
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
            <div class="modal-popup">
                <span class="modal-close" title="Close">&times;</span>
                <h3>Coming soon!</h3>
                <img src="images/mascot.svg" alt="Mascot" class="modal-image">
                <p>Our workshop will soon be able to take on more orders at once!</p> 
                <p>As a thank you for requesting your first mascot, you're eligible for an <span>earlybird discount</span> on your next one.</p>
                <p>Sign up below to be the first to know when new mascot slots open up!</p>
                <form class="modal-cta-form" name="mascot-notify" method="POST" data-netlify="true" netlify-honeypot="bot-field">
                <input type="hidden" name="form-name" value="mascot-notify">
                <input type="hidden" name="source" value="Add Mascot Modal">
                <p style="display:none;">
                    <label>Don't fill this out if you're human: <input name="bot-field"></label>
                </p>
                <input type="text" name="name" placeholder="Your name" required>
                <input type="email" name="email" placeholder="Your email" required>
                <button type="submit" class="button-primary">Notify Me</button>
                </form>
                <div class="modal-success" style="display:none;">
                <p>Thank you! You'll get an update soon.</p>
                </div>
            </div>
            `;
            document.body.appendChild(modal);

            // Close logic
            modal.querySelector('.modal-close').onclick = closeMascotModal;
            modal.onclick = function (e) {
                if (e.target === modal) closeMascotModal();
            };

            // Form submission logic
            const form = modal.querySelector('.modal-cta-form');
            form.onsubmit = function (e) {
                e.preventDefault();
                form.style.display = 'none';
                modal.querySelector('.modal-success').style.display = 'block';
                setTimeout(closeMascotModal, 2000); // Show success for 2s, then close
            };
        }
        modal.style.display = 'flex';
    }

    function closeMascotModal() {
        if (modal) modal.style.display = 'none';
    }


    // Initial run
    calculateEstimate();

    // Overview display 
    if (steps[currentStep]?.querySelector('#summary')) {
        console.log("Summary div found. Populating...");
        populateSummary();
    }

    function populateSummary() {
        const summaryContainer = document.getElementById('summary');
        if (!summaryContainer) {
            console.error("❌ Could not find #summary container!");
            return;
        }

        console.log("✅ Populating summary...");

        const getVal = name => {
            const field = form.querySelector(`[name="${name}"]`);
            if (!field) return '';
            if (field.type === 'checkbox') return field.checked ? 'Yes' : 'No';
            if (field.type === 'radio') {
                const checked = form.querySelector(`[name="${name}"]:checked`);
                return checked ? checked.value : '';
            }
            return field.value;
        };

        const values = {
            name: getVal('name'),
            email: getVal('email'),
            social: getVal('social'),
            whatsapp: getVal('whatsapp'),
            currency: getVal('currency'),
            shipping_region: getVal('shipping_region'),
            character: getVal('character'),
            fandom: getVal('fandom'),
            description: getVal('description'),
            link: getVal('link'),
            quote: getVal('quote'),
            mascot_size: getVal('mascot_size'),
            addon_clothing: getVal('addon_clothing'),
            addon_hair: getVal('addon_hair'),
            addon_props: getVal('addon_props'),
            display_stand: getVal('display_stand'),
            is_gift: getVal('is_gift')
        };

        const estimatedPrice = document.querySelector('#estimatedPrice')?.textContent || '';
        const estimatedTime = document.querySelector('#estimatedTime')?.textContent || '';

        const colorPreviewHTML = [...document.querySelectorAll('.color-preview')].map(span => {
            const bg = span.style.backgroundColor;
            return bg && bg !== 'transparent'
                ? `<span style="display:inline-block;width:20px;height:20px;background:${bg};border-radius:4px;margin-right:6px;"></span>`
                : '';
        }).join('');

        summaryContainer.innerHTML = `
        <h3>Contact Details</h3>
        <ul>
            <li><strong>Name:</strong> ${values.name}</li>
            <li><strong>Email:</strong> ${values.email}</li>
            ${values.social ? `<li><strong>Instagram:</strong> ${values.social}</li>` : ''}
            ${values.whatsapp ? `<li><strong>WhatsApp:</strong> ${values.whatsapp}</li>` : ''}
            <li><strong>Currency:</strong> ${values.currency}</li>
            <li><strong>Shipping Region:</strong> ${values.shipping_region}</li>
        </ul>

        <h3>Character Design</h3>
        <ul>
            <li><strong>Character Name:</strong> ${values.character}</li>
            ${values.fandom ? `<li><strong>Fandom:</strong> ${values.fandom}</li>` : ''}
            <li><strong>Description:</strong> ${values.description}</li>
            ${values.link ? `<li><strong>Link:</strong> ${values.link}</li>` : ''}
            ${values.quote ? `<li><strong>Inscription:</strong> ${values.quote}</li>` : ''}
        </ul>

        <h3>Color Selection</h3>
        <div class="color-preview-summary">
            ${colorPreviewHTML}
        </div>

        <h3>Add-ons</h3>
        <ul>
            <li><strong>Mascot Size:</strong> ${values.mascot_size}</li>
            <li><strong>Detachable Clothes:</strong> ${values.addon_clothing}</li>
            <li><strong>Fancy Hair:</strong> ${values.addon_hair}</li>
            <li><strong>Props:</strong> ${values.addon_props}</li>
            <li><strong>Stand:</strong> ${values.display_stand}</li>
            <li><strong>Gift:</strong> ${values.is_gift}</li>
        </ul>

        <h3>Estimate</h3>
        <ul>
            <li><strong>Estimated Price:</strong> ${estimatedPrice}</li>
            <li><strong>Estimated Timeline:</strong> ${estimatedTime}</li>
        </ul>
    `;
    }

});
