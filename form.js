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

let selectedColors = [];

colorInput.addEventListener('input', () => {
    if (selectedColors.length < 5) {
        const color = colorInput.value;
        // Avoid duplicates
        if (!selectedColors.includes(color)) {
            selectedColors.push(color);
            updatePreviews();
        }
    }
});

resetButton.addEventListener('click', () => {
    selectedColors = [];
    updatePreviews();
});

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
}

// Initialize previews on page load
updatePreviews();

