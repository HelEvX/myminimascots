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
        } else if (e.target.id === 'addDoll') {
            alert('This feature will allow adding more dolls in a future update.');
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
    const sizeRadios = form.querySelectorAll('input[name="doll_size"]');
    const clothing = form.querySelector('input[name="addon_clothing"]');
    const hair = form.querySelector('input[name="addon_hair"]');
    const props = form.querySelector('input[name="addon_props"]');
    const stand = form.querySelector('select[name="display_stand"]');
    const priceOutput = document.querySelector('#estimatedPrice');
    const timeOutput = document.querySelector('#estimatedTime');
    const miniNote = document.querySelector('#miniDollNote');

    const inputsToWatch = [
        ...sizeRadios,
        clothing,
        hair,
        props,
        stand,
    ];

    function calculateEstimate() {
        const selectedSize = form.querySelector('input[name="doll_size"]:checked');
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
            doll_size: getVal('doll_size'),
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
            <li><strong>Doll Size:</strong> ${values.doll_size}</li>
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
