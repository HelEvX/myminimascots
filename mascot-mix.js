// Simple state management
const mascotState = {
    base: 'base-1',
    hair: null,
    clothes: null,
    accessories: null,
    pet: null
};

// Load items for a category
function loadCategoryItems(category) {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    // Define items per category (could be loaded from a JSON file)
    const items = {
        'hair': ['hair-1', 'hair-2', 'hair-3', 'hair-4', 'hair-5'],
        'clothes': ['outfit-1', 'outfit-2', 'outfit-3', 'outfit-4', 'outfit-5'],
        'accessories': ['acc-1', 'acc-2', 'acc-3', 'acc-4', 'acc-5'],
        'pets': ['pet-1', 'pet-2', 'pet-3', 'pet-4', 'pet-5']
    };

    items[category].forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item-option';
        itemEl.dataset.item = item;
        itemEl.style.backgroundImage = `url(images/${category}/${item}.png)`;
        itemEl.addEventListener('click', () => selectItem(category, item));
        container.appendChild(itemEl);
    });
}

// Select an item
function selectItem(category, item) {
    mascotState[category] = item;
    updatePreview();
}

// Update the preview
function updatePreview() {
    Object.keys(mascotState).forEach(category => {
        const el = document.getElementById(`mascot-${category}`);
        if (mascotState[category]) {
            if (category === 'base') {
                el.style.backgroundImage = `url(images/bases/${mascotState[category]}.png)`;
            } else {
                el.style.backgroundImage = `url(images/${category}/${mascotState[category]}.png)`;
            }
        } else {
            el.style.backgroundImage = 'none';
        }
    });
}

// Randomize function
document.getElementById('randomize-btn').addEventListener('click', () => {
    const bases = ['base-1', 'base-2', 'base-3', 'base-4', 'base-5'];
    mascotState.base = bases[Math.floor(Math.random() * bases.length)];
    updatePreview();
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadCategoryItems(btn.dataset.category);
    });
});

// Initialize
loadCategoryItems('hair');
updatePreview();
