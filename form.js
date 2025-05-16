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

                // Scroll to top of the newly shown step
                document.querySelector('main').scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Check if the NEW step (after showStep) contains the summary
                if (steps[currentStep]?.querySelector('#summary')) {
                    populateSummary();
                }
            }
        } else if (e.target.classList.contains('prev')) {
            currentStep--;
            showStep(currentStep);

            // Scroll to top of the newly shown step
            document.querySelector('main').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        const step = steps[stepIndex];
        const inputs = step.querySelectorAll('input, textarea, select');
        let valid = true;

        // Hide the mascot name error by default
        const characterInput = step.querySelector('input[name="character"]');
        const characterError = document.getElementById('characterNameError');
        if (characterError) characterError.style.display = 'none';

        inputs.forEach((input) => {
            if (!input.checkValidity()) {
                input.classList.add('error');
                valid = false;

                // Show mascot name error if that's the invalid field
                if (input === characterInput && characterError) {
                    characterError.style.display = 'block';
                }
            } else {
                input.classList.remove('error');
            }
        });

        // If not valid, scroll to top of step
        if (!valid) {
            step.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

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

    // Help Modal Logic


    const openHelpBtn = document.querySelector('.open-help-modal');
    const helpModal = document.querySelector('.help-modal');
    const closeHelpBtn = helpModal.querySelector('.help-modal-close');

    openHelpBtn.addEventListener('click', function (e) {
        e.preventDefault();
        helpModal.classList.add('is-open');
    });

    closeHelpBtn.addEventListener('click', function (e) {
        e.preventDefault();
        helpModal.classList.remove('is-open');
    });

    // Optional: close modal when clicking outside the modal window
    helpModal.addEventListener('click', function (e) {
        if (e.target === helpModal) {
            helpModal.classList.remove('is-open');
        }
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

    // Currency conversion logic
    const currencySelect = form.querySelector('select[name="currency"]');

    const exchangeRates = {
        GBP: { rate: 1, symbol: '£', suffix: 'GBP' },
        EUR: { rate: 1.17, symbol: '€', suffix: 'EUR' },
        USD: { rate: 1.25, symbol: '$', suffix: 'USD' },
        AUD: { rate: 1.9, symbol: '$', suffix: 'AUD' },
        'n/a': { rate: 1, symbol: '', suffix: '' }
    };

    function formatCurrency(value, symbol, suffix) {
        return `${symbol}${value.toFixed(2)} ${suffix}`.trim();
    }

    function calculateEstimate() {
        const selectedSize = form.querySelector('input[name="mascot_size"]:checked');
        const size = selectedSize ? selectedSize.value : 'full';
        let total = 0;
        let weeks = 2;

        // Reset styles
        if (miniNote) {
            miniNote.style.display = 'none';
        }

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

        // --- Currency logic ---
        const currency = currencySelect?.value || 'GBP';
        const { rate, symbol, suffix } = exchangeRates[currency] || exchangeRates['GBP'];
        const convertedTotal = total * rate;

        priceOutput.textContent = formatCurrency(convertedTotal, symbol, suffix);
        timeOutput.textContent = `~${weeks} weeks`;

    }

    // Add event listeners
    inputsToWatch.forEach(input => {
        if (input) {
            input.addEventListener('change', calculateEstimate);
        }
    });

    // Listen for currency changes
    if (currencySelect) {
        currencySelect.addEventListener('change', calculateEstimate);
    }

    // Initial run
    calculateEstimate();


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


    // Required Checkboxes
    const requiredCheckboxes = [
        document.querySelector('input[name="agree_emails"]'),
        document.querySelector('input[name="agree_terms"]'),
        document.querySelector('input[name="gdpr_consent"]')
    ];
    const reviewBtn = document.getElementById('reviewBtn');

    function updateReviewBtnState() {
        const allChecked = requiredCheckboxes.every(cb => cb && cb.checked);
        reviewBtn.disabled = !allChecked;
    }

    // Listen for changes on checkboxes
    requiredCheckboxes.forEach(cb => {
        if (cb) cb.addEventListener('change', updateReviewBtnState);
    });

    // Initial state (in case of browser autofill)
    updateReviewBtnState();


    // Modal logic for "Cancel & Leave Feedback" (dynamic insertion)
    const exitBtn = document.getElementById('exitBtn');

    function insertExitModal() {
        if (document.getElementById('exitModal')) return; // Prevent duplicates

        const modalHTML = `
        <div id="exitModal" class="exit-modal" role="dialog" aria-modal="true">
            <div class="exit-modal-content">
                <h3>Leaving so soon?</h3>
                <p>We'd love to know why you're not continuing:</p>
                <form id="exitPollForm">
                    <label class="custom-radio"><input type="radio" name="exit_reason" value="Too expensive"><span class="radio"></span> Too expensive</label>
                    <label class="custom-radio"><input type="radio" name="exit_reason" value="Timeline too long"><span class="radio"></span> Timeline too long</label>
                    <label class="custom-radio"><input type="radio" name="exit_reason" value="Just browsing"><span class="radio"></span> Just browsing</label>
                    <label class="custom-radio"><input type="radio" name="exit_reason" value="Other"><span class="radio"></span> Something else</label>
                    <textarea name="exit_comments" placeholder="Anything else?"></textarea>
                    <div class="button-group">
                        <button type="submit" class="button-primary">Submit Feedback & Exit</button>
                        <button type="button" id="closeExitModal" class="button-secondary">Back</button>
                    </div>
                </form>
            </div>
        </div>
    `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    if (exitBtn) {
        exitBtn.addEventListener('click', function () {
            insertExitModal();

            const exitModal = document.getElementById('exitModal');
            const closeExitModal = document.getElementById('closeExitModal');
            const exitPollForm = document.getElementById('exitPollForm');

            if (exitModal && closeExitModal && exitPollForm) {
                exitModal.classList.add('active');

                closeExitModal.addEventListener('click', function () {
                    exitModal.classList.remove('active');
                });

                exitPollForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    exitModal.classList.remove('active');
                    window.location.href = '/';
                });
            }
        });
    }

    //// PAGE 5 Overview Display

    function formatDate(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Main function
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

        // Get selects for user-friendly labels
        const shippingRegionSelect = form.querySelector('select[name="shipping_region"]');
        const mascotSizeSelect = form.querySelector('select[name="mascot_size"]');
        const displayStandSelect = form.querySelector('select[name="display_stand"]');

        const shippingRegionLabel = shippingRegionSelect
            ? shippingRegionSelect.options[shippingRegionSelect.selectedIndex].textContent
            : getVal('shipping_region');

        const mascotSizeLabel = mascotSizeSelect
            ? mascotSizeSelect.options[mascotSizeSelect.selectedIndex].textContent
            : getVal('mascot_size');

        const displayStandLabel = displayStandSelect
            ? displayStandSelect.options[displayStandSelect.selectedIndex].textContent
            : getVal('display_stand');

        // Get further comments
        const furtherComments = getVal('further_comments');

        const values = {
            name: getVal('name'),
            email: getVal('email'),
            social: getVal('social'),
            whatsapp: getVal('whatsapp'),
            currency: getVal('currency'),
            shipping_region: shippingRegionLabel,
            character: getVal('character'),
            fandom: getVal('fandom'),
            description: getVal('description'),
            upload: (() => {
                const fileInput = form.querySelector('input[type="file"][name="files"]');
                return fileInput && fileInput.files && fileInput.files.length > 0 ? 'Yes' : 'No';
            })(),
            link: getVal('link'),
            quote: getVal('quote'),
            mascot_size: mascotSizeLabel,
            addon_clothing: getVal('addon_clothing'),
            addon_hair: getVal('addon_hair'),
            addon_props: getVal('addon_props'),
            display_stand: displayStandLabel,
            deadline: getVal('deadline'),
            is_gift: getVal('is_gift'),
            further_comments: furtherComments
        };

        const estimatedPrice = document.querySelector('#estimatedPrice')?.textContent || '';
        const estimatedTime = document.querySelector('#estimatedTime')?.textContent || '';

        const colorPreviewHTML = [...document.querySelectorAll('.color-preview')].map(span => {
            const bg = span.style.backgroundColor;
            return bg && bg !== 'transparent'
                ? `<span class="summary-color-preview" data-color="${bg}"></span>`
                : '';
        }).join('');


        summaryContainer.innerHTML = `
        <h3>Contact Details</h3>
            <ul>
                <li>Name: ${values.name}</li>
                <li>Email: ${values.email}</li>
                ${values.social ? `<li>Instagram: ${values.social}</li>` : ''}
                ${values.whatsapp ? `<li>WhatsApp: ${values.whatsapp}</li>` : ''}
                <li>Currency: ${values.currency}</li>
                <li>Shipping Region: ${values.shipping_region}</li>
            </ul>

            <h3>Character Design</h3>
            <ul>
                <li>Character Name: ${values.character}</li>
                ${values.fandom ? `<li>Fandom: ${values.fandom}</li>` : ''}
                <li>Description: ${values.description}</li>
                <li>Upload Provided: ${values.upload}</li>
                ${values.link ? `<li>Reference Link: <a href="${values.link}" target="_blank" rel="noopener">${values.link}</a></li>` : ''}
                ${values.quote ? `<li>Inscription: ${values.quote}</li>` : ''}
            </ul>

            <h3>Color Selection</h3>
            <div class="summary-color-previews">
                ${colorPreviewHTML}
            </div>

            <h3>Order Details</h3>
            <ul>
                <li>Mascot Size: ${values.mascot_size}</li>
                <li>Detachable Clothes: ${values.addon_clothing}</li>
                <li>Fancy Hair: ${values.addon_hair}</li>
                <li>Props: ${values.addon_props}</li>
                <li>Stand: ${values.display_stand}</li>
                ${values.deadline ? `<li>Requested Deadline: ${formatDate(values.deadline)}</li>` : ''}
                <li>Gift: ${values.is_gift}</li>
            </ul>

            <h3>Estimate</h3>
            <ul>
                <li>Estimated Price: ${estimatedPrice}</li>
                <li>Estimated Timeline: ${estimatedTime}</li>
            </ul>

        ${values.further_comments ? `
        <h3>Additional Comments</h3>
        <div class="further-comments-block">
            <p>${values.further_comments.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
    `;

        // Set background colours for summary color preview dots
        summaryContainer.querySelectorAll('.summary-color-preview').forEach(el => {
            el.style.backgroundColor = el.getAttribute('data-color');
        });
    }

    document.querySelector('.review-print-btn').addEventListener('click', () => {
        window.print();
    });

    document.querySelector('.clear').addEventListener('click', () => {
        const form = document.querySelector('form');
        if (form) form.reset();

        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        const firstStep = document.querySelector('.form-step');
        if (firstStep) firstStep.classList.add('active');

        document.querySelectorAll('.progress-step').forEach(step => step.classList.remove('active'));
        const firstProgressStep = document.querySelector('.progress-step');
        if (firstProgressStep) firstProgressStep.classList.add('active');

    });


});
