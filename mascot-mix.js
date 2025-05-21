const mascotAssets = {
    bases: [
        { id: 'base-1', name: 'Light Skin T-shirt', path: 'images/bases/mascotmix-base1.jpg' },
        { id: 'base-2', name: 'Dark Skin Traditional', path: 'images/bases/mascotmix-base2.jpg' },
        { id: 'base-3', name: 'Light Skin Fancydress', path: 'images/bases/mascotmix-base3.jpg' },
        { id: 'base-4', name: 'Animal Handpuppet', path: 'images/bases/mascotmix-base4.jpg' },
        { id: 'base-5', name: 'Coloured Creature', path: 'images/bases/mascotmix-base5.jpg' },
        { id: 'base-6', name: 'Light Skin Casual', path: 'images/bases/mascotmix-base6.jpg' },
        { id: 'base-7', name: 'Medium Skin Sleeveless', path: 'images/bases/mascotmix-base7.jpg' },
        { id: 'base-8', name: 'Light Skin Trousers', path: 'images/bases/mascotmix-base8.jpg' },
        { id: 'base-9', name: 'Light Skin Shirt', path: 'images/bases/mascotmix-base9.jpg' }
    ],
    hair: [
        { id: 'hair-1', name: 'Short Sideswept, Blonde', path: 'images/hair/mascotmix-hair1.jpg' },
        { id: 'hair-2', name: 'Combover, Gray', path: 'images/hair/mascotmix-hair2.jpg' },
        { id: 'hair-3', name: 'Curlers, Bleached', path: 'images/hair/mascotmix-hair3.jpg' },
        { id: 'hair-4', name: 'Short, White', path: 'images/hair/mascotmix-hair4.jpg' },
        { id: 'hair-5', name: 'Long n Messy, Brown', path: 'images/hair/mascotmix-hair5.jpg' },
        { id: 'hair-6', name: 'Tight Curls M, Brown', path: 'images/hair/mascotmix-hair6.jpg' },
        { id: 'hair-7', name: 'Short Sideswept, Brown', path: 'images/hair/mascotmix-hair7.jpg' },
        { id: 'hair-8', name: 'Short with Beard, Salt n Pepper', path: 'images/hair/mascotmix-hair8.jpg' },
        { id: 'hair-9', name: 'Moustache', path: 'images/hair/mascotmix-hair9.jpg' },
        { id: 'hair-0', name: 'Tight Curls F, Brown', path: 'images/hair/mascotmix-hair0.jpg' },
        { id: 'hair-x', name: 'Makeup', path: 'images/hair/mascotmix-makeup.jpg' }
    ],
    outfits: [
        { id: 'outfit-1', name: 'Waistcoat', path: 'images/outfits/mascotmix-outfit1.jpg' },
        { id: 'outfit-2', name: 'Ethnic Dress', path: 'images/outfits/mascotmix-outfit2.jpg' },
        { id: 'outfit-3', name: 'Fluffy Robe', path: 'images/outfits/mascotmix-outfit3.jpg' },
        { id: 'outfit-4', name: 'Colourful Jacket', path: 'images/outfits/mascotmix-outfit4.jpg' },
        { id: 'outfit-5', name: 'Formal Suit', path: 'images/outfits/mascotmix-outfit5.jpg' },
        { id: 'outfit-6', name: 'Feminine Dress', path: 'images/outfits/mascotmix-outfit6.jpg' },
        { id: 'outfit-7', name: 'Winter Coat', path: 'images/outfits/mascotmix-outfit7.jpg' }
    ],
    accessories: [
        { id: 'acc-1', name: 'Carnival', path: 'images/accessories/mascotmix-accessories1.jpg' },
        { id: 'acc-2', name: 'Farmer Cap', path: 'images/accessories/mascotmix-accessories2.jpg' },
        { id: 'acc-3', name: 'Ring', path: 'images/accessories/mascotmix-accessories3.jpg' },
        { id: 'acc-4', name: 'Beanie Hat', path: 'images/accessories/mascotmix-accessories4.jpg' },
        { id: 'acc-5', name: 'Country Flag', path: 'images/accessories/mascotmix-accessories5.jpg' },
        { id: 'acc-6', name: 'Beret', path: 'images/accessories/mascotmix-accessories6.jpg' },
        { id: 'acc-7', name: 'Chef Hat', path: 'images/accessories/mascotmix-accessories7.jpg' },
        { id: 'acc-8', name: 'Beaded Headdress', path: 'images/accessories/mascotmix-accessories8.jpg' },
        { id: 'acc-9a', name: 'Glasses', path: 'images/accessories/mascotmix-accessories9a.jpg' },
        { id: 'acc-9b', name: 'Necklace', path: 'images/accessories/mascotmix-accessories9b.jpg' },
        { id: 'acc-0', name: 'Scarf', path: 'images/accessories/mascotmix-accessories0.jpg' }
    ],
    extras: [
        { id: 'extra-1', name: 'Tiny Crochet (Vegetable)', path: 'images/extras/mascotmix-extra1.jpg' },
        { id: 'extra-2', name: 'Paper Prop', path: 'images/extras/mascotmix-extra2.jpg' },
        { id: 'extra-3', name: 'Tiny Crochet (Guitar)', path: 'images/extras/mascotmix-extra3.jpg' },
        { id: 'extra-4', name: 'Tiny Crochet (Gear)', path: 'images/extras/mascotmix-extra4.jpg' },
        { id: 'extra-5', name: '3D Printed Prop', path: 'images/extras/mascotmix-extra5.jpg' }
    ]
};


const mascotState = {
    bases: null,
    hair: null,
    outfits: null,
    accessories: null,
    extras: null
};

function loadCategoryItems(category) {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    const items = mascotAssets[category];

    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item-option';
        itemEl.dataset.itemId = item.id;
        itemEl.dataset.category = category;

        const img = document.createElement('img');
        img.src = item.path;
        img.alt = item.name;
        img.className = 'item-thumbnail';

        const label = document.createElement('span');
        label.className = 'item-name';
        label.textContent = item.name;

        itemEl.appendChild(img);
        itemEl.appendChild(label);

        itemEl.addEventListener('click', (e) => {
            e.preventDefault();
            selectItem(category, item.id, item.path, item.name);
        });

        container.appendChild(itemEl);
    });

    if (mascotState[category] && mascotState[category].id) {
        highlightSelectedItem(category, mascotState[category].id);
    }
}

function selectItem(category, itemId, itemPath, itemName) {

    if (!itemName) {
        const items = mascotAssets[category];
        const item = items.find(i => i.id === itemId);
        itemName = item ? item.name : '';
    }

    mascotState[category] = {
        id: itemId,
        path: itemPath,
        name: itemName
    };

    updateDisplay();

    highlightSelectedItem(category, itemId);
}

function updateDisplay() {

    if (mascotState.bases && mascotState.bases.path) {
        const baseImage = document.getElementById('selected-base-image');
        if (baseImage) {
            baseImage.src = mascotState.bases.path;
            baseImage.alt = mascotState.bases.name || 'Base Mascot';
        }
    }

    updateSelectionTile('hair', 'selected-hair-image');

    updateSelectionTile('outfits', 'selected-outfits-image');

    updateSelectionTile('accessories', 'selected-accessories-image');

    updateSelectionTile('extras', 'selected-extras-image');
}

function updateSelectionTile(category, imageId) {
    const image = document.getElementById(imageId);
    if (!image) {
        console.error(`Image element with ID ${imageId} not found`);
        return;
    }

    if (mascotState[category] && mascotState[category].path) {
        image.src = mascotState[category].path;
        image.alt = mascotState[category].name || `Selected ${category}`;
        image.style.display = 'block';
    } else {
        image.src = '';
        image.alt = `No ${category} selected`;
        image.style.display = 'none';
    }
}

function highlightSelectedItem(category, itemId) {

    document.querySelectorAll(`.item-option[data-category="${category}"]`).forEach(el => {
        el.classList.remove('selected');
    });

    const selectedItem = document.querySelector(`.item-option[data-category="${category}"][data-item-id="${itemId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
}

function randomizeCategory(category) {
    const randomItem = getRandomItem(category);
    if (randomItem) {
        selectItem(category, randomItem.id, randomItem.path, randomItem.name);
    }
}

function randomizeMascot() {
    randomizeCategory('bases');
    randomizeCategory('hair');
    randomizeCategory('outfits');
    randomizeCategory('accessories');
    randomizeCategory('extras');
}

function getRandomItem(category) {
    const items = mascotAssets[category];
    if (!items || items.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function findItemNameById(category, id) {
    if (!id) return null;

    const items = mascotAssets[category];
    const item = items.find(item => item.id === id);
    return item ? item.name : null;
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

function openOrderModal() {

    if (!mascotState.bases) {
        alert('Please select a base mascot first!');
        return;
    }

    const modal = document.getElementById('order-modal');
    if (!modal) {
        console.error('Order modal element not found');
        return;
    }

    updateSummaryPreview();
    updateOrderDetails();

    modal.style.display = 'flex';

    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            e.preventDefault();
            modal.style.display = 'none';
        });
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            e.preventDefault();
            modal.style.display = 'none';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function updateSummaryPreview() {

    if (mascotState.bases && mascotState.bases.path) {
        const summaryBaseImage = document.getElementById('summary-base-image');
        if (summaryBaseImage) {
            summaryBaseImage.src = mascotState.bases.path;
            summaryBaseImage.alt = mascotState.bases.name || 'Base Mascot';
        }
    }

    updateSummaryTile('hair', 'summary-hair-image', 'summary-hair-tile');
    updateSummaryTile('outfits', 'summary-outfits-image', 'summary-outfits-tile');
    updateSummaryTile('accessories', 'summary-accessories-image', 'summary-accessories-tile');
    updateSummaryTile('extras', 'summary-extras-image', 'summary-extras-tile');
}

function updateSummaryTile(category, imageId, tileId) {
    const image = document.getElementById(imageId);
    const tile = document.getElementById(tileId);

    if (!image || !tile) {
        console.error(`Summary elements not found: ${imageId} or ${tileId}`);
        return;
    }

    if (mascotState[category] && mascotState[category].path) {
        image.src = mascotState[category].path;
        image.alt = mascotState[category].name || `Selected ${category}`;
        tile.style.display = 'block';
    } else {
        tile.style.display = 'none';
    }
}

function updateOrderDetails() {
    const detailsContainer = document.getElementById('order-details');
    if (!detailsContainer) {
        console.error('Order details container not found');
        return;
    }

    const baseName = mascotState.bases?.name || 'None';
    const hairName = mascotState.hair?.name || 'None';
    const outfitsName = mascotState.outfits?.name || 'None';
    const accessoriesName = mascotState.accessories?.name || 'None';
    const extrasName = mascotState.extras?.name || 'None';

    detailsContainer.innerHTML = `
    <h4>Your Selections:</h4>
    <ul>
    <li><strong>Base Mascot:</strong> ${baseName}</li>
    <li><strong>Hairstyle:</strong> ${hairName}</li>
    <li><strong>Outfit:</strong> ${outfitsName}</li>
    <li><strong>Accessories:</strong> ${accessoriesName}</li>
    <li><strong>Extra props:</strong> ${extrasName}</li>
    </ul>
  `;
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

function handleFormSubmission(e) {
    e.preventDefault();

    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const consent = document.getElementById('consent').checked;

    if (!customerName || !customerEmail || !consent) {
        alert('Please fill in all required fields');
        return;
    }

    const orderData = {
        customer: {
            name: customerName,
            email: customerEmail,
            consent: consent
        },
        mascot: {
            base: {
                id: mascotState.bases?.id,
                name: mascotState.bases?.name
            },
            hair: {
                id: mascotState.hair?.id,
                name: mascotState.hair?.name
            },
            outfits: {
                id: mascotState.outfits?.id,
                name: mascotState.outfits?.name
            },
            accessories: {
                id: mascotState.accessories?.id,
                name: mascotState.accessories?.name
            },
            extras: {
                id: mascotState.extras?.id,
                name: mascotState.extras?.name
            }
        }
    };

    console.log('Order data:', orderData);
    submitOrderData(orderData);
}

function submitOrderData(orderData) {

    setTimeout(() => {

        const orderModal = document.getElementById('order-modal');
        if (orderModal) {
            orderModal.style.display = 'none';
        }

        const thankYouModal = document.getElementById('thank-you-modal');
        const emailDisplay = document.getElementById('customer-email-display');

        if (thankYouModal && emailDisplay) {
            emailDisplay.textContent = orderData.customer.email;
            thankYouModal.style.display = 'flex';

            const closeThankYouBtn = document.getElementById('close-thank-you');
            if (closeThankYouBtn) {
                closeThankYouBtn.addEventListener('click', () => {
                    e.preventDefault();
                    thankYouModal.style.display = 'none';
                    resetMascotBuilder();
                });
            }
        }
    }, 1000);
}

function resetMascotBuilder() {

    mascotState.hair = null;
    mascotState.outfits = null;
    mascotState.accessories = null;
    mascotState.extras = null;

    const randomBase = getRandomItem('bases');
    if (randomBase) {
        selectItem('bases', randomBase.id, randomBase.path, randomBase.name);
    }

    updateDisplay();

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.reset();
    }
}

function setupRandomizeButtons() {
    setupRandomizeButton('randomize-base-btn', 'bases');
    setupRandomizeButton('randomize-hair-btn', 'hair');
    setupRandomizeButton('randomize-outfits-btn', 'outfits');
    setupRandomizeButton('randomize-accessories-btn', 'accessories');
    setupRandomizeButton('randomize-extras-btn', 'extras');
}

function setupRandomizeButton(buttonId, category) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            randomizeCategory(category);
        });
    }
}


function initializePage() {
    const baseTab = document.querySelector('.tab-btn[data-category="bases"]');
    if (baseTab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        baseTab.classList.add('active');
    }

    loadCategoryItems('bases');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadCategoryItems(btn.dataset.category);
        });
    });

    setupRandomizeButtons();

    const saveDesignBtn = document.getElementById('save-design-btn');
    if (saveDesignBtn) {
        saveDesignBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openOrderModal();
        });
    }

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleFormSubmission);
    }

    randomizeMascot();
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        initializePage();
    }, 100);
});
