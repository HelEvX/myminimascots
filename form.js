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
                // Session storage name + email
                if (currentStep === 0) {
                    const nameInput = form.querySelector('input[name="name"]');
                    const emailInput = form.querySelector('input[name="email"]');
                    if (nameInput && emailInput) {
                        window.sessionStorage.setItem('userName', nameInput.value.trim());
                        window.sessionStorage.setItem('userEmail', emailInput.value.trim());
                    }
                }

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
    const confirmButton = document.getElementById('confirmColor');
    const clearLinks = document.querySelectorAll('.clear-color-link');

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
            // Update the hidden input for this slot
            const hiddenInput = document.getElementById(`colour${i + 1}`);
            if (hiddenInput) {
                hiddenInput.value = selectedColors[i] || '';
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

    // Add clear functionality for each preview
    clearLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const index = parseInt(this.getAttribute('data-index'), 10);
            // Remove the color at this index
            selectedColors.splice(index, 1);
            updatePreviews();
        });
    });

    updatePreviews();


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
    const maxFileSize = 1 * 1024 * 1024; // 1 MB size limit

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
                alert('File size exceeds the maximum allowed size of 1MB. Please upload a smaller file. If your screenshot is too large, try compressing it using a free tool like TinyPNG (https://tinypng.com) or WeCompress (https://wecompress.com).');
                fileInput.value = ""; // Clear the input field
            }
        });
    }


    // Gift Toggle Logic

    const deadlineToggle = document.getElementById('toggle-deadline');
    const deadlineContainer = document.getElementById('deadline-container');
    const deadlineNote = document.getElementById('deadline-note');

    deadlineToggle.addEventListener('change', function () {
        const show = this.checked ? 'block' : 'none';
        deadlineContainer.style.display = show;
        deadlineNote.style.display = show;
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
        const size = selectedSize ? selectedSize.value : "Signature Mascot (30cm)";
        let total = 0;
        let weeks = 2;

        // Reset styles
        if (miniNote) {
            miniNote.style.display = 'none';
        }

        // Mascot size logic
        if (size === 'Miniature Mascot (10cm)') {
            total = 20;

            // Disable incompatible options
            [clothing, hair, props].forEach(el => {
                el.checked = false;
                el.disabled = true;
            });

            miniNote.style.display = 'block';
            weeks = 2;
        } else if (size === 'Handpuppet') {
            total = 45;

            // Enable add-ons
            [clothing, hair, props].forEach(el => el.disabled = false);

            if (clothing.checked) total += 15;
            if (hair.checked) total += 10;
            if (props.checked) total += 20;

            weeks = 3;
        } else {
            total = 35;

            // Enable add-ons
            [clothing, hair, props].forEach(el => el.disabled = false);

            if (clothing.checked) total += 20;
            if (hair.checked) total += 10;
            if (props.checked) total += 20;

            // Timeline logic for full-size
            const hasAddons = clothing.checked || hair.checked || props.checked || stand.value !== '';
            weeks = hasAddons ? 4 : 2;
        }

        // Stand costs
        switch (stand.value) {
            case 'Basic':
                total += 5;
                break;
            case 'Custom':
                total += 15;
                break;
            case 'Deluxe':
                total += 25;
                break;
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
        if (selected === 'Miniature Mascot (10cm)') {
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
            <div class="modal-content">
                <span class="modal-close" title="Close">&times;</span>
                <h3>Hi collector!</h3>
                <div class="modal-mascotcollection">
                    <img src="images/assets/mascot-face2.svg" alt="Mascot face drawing" class="modal-image" id="face2">
                    <img src="images/assets/mascot-face1.svg" alt="Mascot face drawing" class="modal-image" id="face1">
                    <img src="imagesassets//mascot-face3.svg" alt="Mascot face drawing" class="modal-image" id="face3">
                </div>
                <p>While our little workshop will focus on your current mascot, we'd <em>love</em> to create more for you in the future.</p> 
                <p><strong>Pop your details below and you'll:</strong></p>
                <ul class="benefits-list">
                    <li>📬 Be the first to know when new mascot slots open up</li>
                    <li>🎁 Receive a special little gift with your next order</li>
                    <li>✨ Secure your ticket for our 'mascot friend' lottery</li>
                </ul>
                    <form class="modal-cta-form"
                        name="mascot-notify"
                        method="POST"
                        data-netlify="true"
                        netlify-honeypot="bot-field"
                        autocomplete="on">
                        <input type="hidden" name="form-name" value="mascot-notify">
                        <input type="hidden" name="source" value="Add Mascot Modal">
                        <p style="display:none;">
                            <label>Don't fill this out if you're human: <input name="bot-field"></label>
                        </p>
                        <div class="inputfields-row">
                            <input type="text" id="notifyFirstName" name="first_name" placeholder="Your first name" required>
                            <input type="email" id="notifyEmail" name="email" placeholder="Your email" required>
                        </div>
                        <label class="custom-checkbox">
                            <input type="checkbox" id="newsletterConsent" name="consent" required>
                            <span class="checkmark"></span> Yes, I want to receive updates and offers by email
                        </label>
                        <button type="submit" class="button-primary">Put me on the Many-Mini-Mascots list!</button>
                    </form>
            </div>
            <div class="modal-success" style="display:none;">
                <h4>Thank you!</h4>
                <p>You'll get an update soon.</p>
            </div>
        </div>
        `;
            document.body.appendChild(modal);

            // Prefill name (commented out) and email fields from sessionStorage
            // const storedName = window.sessionStorage.getItem('userName') || '';
            const storedEmail = window.sessionStorage.getItem('userEmail') || '';

            // const notifyNameInput = modal.querySelector('#notifyName');
            const notifyEmailInput = modal.querySelector('#notifyEmail');

            // if (notifyNameInput) notifyNameInput.value = storedName;
            if (notifyEmailInput) notifyEmailInput.value = storedEmail;


            // Close logic
            modal.querySelector('.modal-close').onclick = closeMascotModal;
            modal.onclick = function (e) {
                if (e.target === modal) closeMascotModal();
            };

            // Netlify AJAX submission for the earlybird modal form
            const form = modal.querySelector('.modal-cta-form');
            const success = modal.querySelector('.modal-success');
            const content = modal.querySelector('.modal-content');

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(form)).toString()
                })
                    .then(() => {
                        content.style.display = 'none';
                        success.style.display = 'block';
                        setTimeout(closeMascotModal, 2000); // Show success for 2s, then close
                    })
                    .catch(() => alert('There was a problem submitting the form.'));
            });

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
                <div class="exit-modal-main">
                    <h3>Leaving so soon?</h3>
                    <p>We'd love to know why you're not continuing:</p>
                    <form id="exitPollForm" name="exit-poll" method="POST" data-netlify="true" netlify-honeypot="bot-field" autocomplete="on">
                        <input type="hidden" name="form-name" value="exit-poll">
                        <p style="display:none;">
                            <label>Don't fill this out if you're human: <input name="bot-field"></label>
                        </p>
                        <label class="custom-radio"><input type="radio" name="exit_reason" value="Too expensive"><span class="radio"></span> Too expensive</label>
                        <label class="custom-radio"><input type="radio" name="exit_reason" value="Timeline too long"><span class="radio"></span> Timeline too long</label>
                        <label class="custom-radio"><input type="radio" name="exit_reason" value="Just browsing"><span class="radio"></span> Just browsing</label>
                        <label class="custom-radio"><input type="radio" name="exit_reason" value="Other"><span class="radio"></span> Something else</label>
                        <textarea name="exit_comments" placeholder="Anything you wish to add?"></textarea>
                        <div class="button-group">
                            <button type="button" id="closeExitModal" class="button-secondary">Back to Form</button>
                            <button type="submit" class="button-primary">Submit Feedback</button>
                        </div>
                    </form>
                </div>
                <div class="exit-modal-success" style="display:none;">
                    <h4 id="thankYouMessage">Thank you for your feedback!</h4>
                    <div class="newsletter-upsell">
                        <p id="newsletterMessage">Want to stay updated on special offers or quicker turnaround times?</p>
                        <form id="newsletterForm" name="exit-newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field2">
                            <input type="hidden" name="form-name" value="exit-newsletter">
                            <input type="hidden" name="exit_reason" id="hiddenExitReason">
                            <p style="display:none;">
                                <label>Don't fill this out: <input name="bot-field2"></label>
                            </p>
                            <input type="text" id="newsletterFirstName" name="first_name" placeholder="Your first name" required>
                            <input type="email" id="newsletterEmail" name="email" placeholder="Your email" required>
                            <label class="custom-checkbox">
                                <input type="checkbox" id="newsletterConsent" name="consent" required>
                                <span class="checkmark"></span> Yes, I want to receive updates and offers by email
                            </label>
                            <div class="button-group">
                                <button type="button" id="skipNewsletter" class="button-primary-ghost">No thanks</button>
                                <button type="submit" class="button-primary">Yes please!</button>
                            </div>
                        </form>
                    </div>
                </div>
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
            const exitSuccess = exitModal.querySelector('.exit-modal-success');
            const exitMain = exitModal.querySelector('.exit-modal-main');

            if (exitModal && closeExitModal && exitPollForm && exitSuccess && exitMain) {
                exitModal.classList.add('active');

                closeExitModal.addEventListener('click', function () {
                    exitModal.classList.remove('active');
                    setTimeout(() => {
                        exitModal.parentNode.removeChild(exitModal);
                    }, 300);
                });

                exitPollForm.addEventListener('submit', function (e) {
                    e.preventDefault();


                    // Capture selected exit reason
                    const selectedExitReason = exitPollForm.querySelector('input[name="exit_reason"]:checked')?.value || 'None';

                    fetch('/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams(new FormData(exitPollForm)).toString()
                    })
                        .then(() => {
                            exitMain.style.display = 'none';
                            exitSuccess.style.display = 'block';

                            const thankYouMessage = document.getElementById('thankYouMessage');
                            const newsletterMessage = document.getElementById('newsletterMessage');
                            const newsletterEmail = document.getElementById('newsletterEmail');
                            const hiddenExitReason = document.getElementById('hiddenExitReason');

                            let userNameFromPage1 = window.sessionStorage.getItem('userName') || '';
                            let userEmailFromPage1 = window.sessionStorage.getItem('userEmail') || '';

                            // Personalise thank you message
                            if (thankYouMessage) {
                                thankYouMessage.textContent = `Thank you for your feedback${userNameFromPage1 ? ', ' + userNameFromPage1 : ''}!`;
                            }

                            // Get the selected exit reason (ensure this is inside .then so it's after submit)
                            const selectedExitReason = exitPollForm.querySelector('input[name="exit_reason"]:checked')?.value || 'Other';

                            // Tailored newsletter message based on exit reason
                            let tailoredMessage = "";
                            switch (selectedExitReason) {
                                case "Too expensive":
                                    tailoredMessage =
                                        "<p>We completely understand! These little mascots are a real investment of time and love! </p>" +
                                        "<p>If you'd like, we sometimes offer special promos and last-minute mascot slots (with all the same charm, just a bit more affordable). Just confirm your details below and we'll let you know when something special comes up!</p>";
                                    break;
                                case "Timeline too long":
                                    tailoredMessage =
                                        "<p>We hear you! Sometimes the wait can feel a bit long, can't it? </p>" +
                                        "<p>Every so often we have surprise openings or opportunities (and you'll be the first to know if you're on our list!). Just check your details below and we'll keep you in the loop for any last-minute mascot magic!</p>";
                                    break;
                                case "Just browsing":
                                    tailoredMessage =
                                        "<p>No rush at all! You're always welcome to come back whenever you're ready. </p>" +
                                        "<p>If you'd like to see new mascot stories, special offers, or just a little creative inspiration, simply confirm your details below and we'll stay in touch!</p>";
                                    break;
                                case "Other":
                                default:
                                    tailoredMessage =
                                        "<p>Thank you so much for sharing your thoughts! </p>" +
                                        "<p>If you'd like to stay connected, we sometimes send out little updates, mascot stories, and the odd special offer. Just confirm or update your details below if you fancy hearing from us now and then!</p>";
                                    break;
                            }

                            // Set the tailored message in the modal
                            if (newsletterMessage) {
                                newsletterMessage.textContent = tailoredMessage;
                            }

                            // Pre-fill email and set hidden exit reason
                            if (newsletterEmail) {
                                newsletterEmail.value = userEmailFromPage1;
                            }
                            if (hiddenExitReason) {
                                hiddenExitReason.value = selectedExitReason;
                            }

                            // Use innerHTML to allow the <br> tags to create paragraphs
                            if (newsletterMessage) {
                                newsletterMessage.innerHTML = tailoredMessage;
                            }

                            const newsletterForm = document.getElementById('newsletterForm');
                            const skipNewsletter = document.getElementById('skipNewsletter');

                            // Newsletter form logic
                            newsletterForm.addEventListener('submit', function (e) {
                                e.preventDefault();
                                // Only submit if consent is checked
                                if (!document.getElementById('newsletterConsent').checked) {
                                    alert('Please confirm you want to receive updates by email.');
                                    return;
                                }
                                fetch('/', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: new URLSearchParams(new FormData(newsletterForm)).toString()
                                }).finally(() => {
                                    window.location.href = '/';
                                });
                            });

                            skipNewsletter.addEventListener('click', () => {
                                window.location.href = '/';
                            });
                        })
                        .catch(() => alert('There was a problem submitting your feedback.'));
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

        const colorPreviews = [...document.querySelectorAll('.color-preview')];
        const colorPreviewHTML = [...document.querySelectorAll('.color-preview')].map((span, i) => {
            const hex = selectedColors[i] || '';

            const input = document.getElementById(`colour${i + 1}`);
            if (input) {
                input.value = hex;
            }

            // Build the summary HTML
            return hex
                ? `<span class="summary-color-preview" data-color="${hex}" style="background:${hex};"></span>`
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
            ${values.deadline ? `
            <li>Requested Deadline: ${formatDate(values.deadline)}</li>` : ''}
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

    // CLEAR FORM (not used)
    // document.querySelector('.clear').addEventListener('click', () => {
    //     const form = document.querySelector('form');
    //     if (form) form.reset();

    //     document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    //     const firstStep = document.querySelector('.form-step');
    //     if (firstStep) firstStep.classList.add('active');

    //     document.querySelectorAll('.progress-step').forEach(step => step.classList.remove('active'));
    //     const firstProgressStep = document.querySelector('.progress-step');
    //     if (firstProgressStep) firstProgressStep.classList.add('active');

    // });

    const loadingPopup = document.getElementById('loadingPopup');
    const MIN_LOADER_TIME = 800;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        loadingPopup.style.display = 'flex';
        const startTime = Date.now();

        setTimeout(() => {
            form.submit();
        }, MIN_LOADER_TIME);
    });


});
