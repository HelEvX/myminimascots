// Image assignment
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
        { id: 'extra-1', name: 'Fruit n Veg', path: 'images/extras/mascotmix-extra1.jpg' },
        { id: 'extra-2', name: 'Little Book', path: 'images/extras/mascotmix-extra2.jpg' },
        { id: 'extra-3', name: 'Musical Instruments', path: 'images/extras/mascotmix-extra3.jpg' },
        { id: 'extra-4', name: 'Stage Gear', path: 'images/extras/mascotmix-extra4.jpg' }
    ]
};


// Initialize the state object to track selections
const mascotState = {
    bases: null,
    hair: null,
    outfits: null,
    accessories: null,
    extras: null
};

// Load items for a category
function loadCategoryItems(category) {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    // Get the assets for the selected category
    const items = mascotAssets[category];

    // Create an element for each item
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item-option';
        itemEl.dataset.itemId = item.id;
        itemEl.dataset.category = category;

        // Create image element
        const img = document.createElement('img');
        img.src = item.path;
        img.alt = item.name;
        img.className = 'item-thumbnail';

        // Create name label
        const label = document.createElement('span');
        label.className = 'item-name';
        label.textContent = item.name;

        // Add to container
        itemEl.appendChild(img);
        itemEl.appendChild(label);

        // Add click event
        itemEl.addEventListener('click', () => selectItem(category, item.id, item.path));

        container.appendChild(itemEl);
    });
}

// Select an item
function selectItem(category, itemId, itemPath, itemName) {
    // Update the state
    mascotState[category] = {
        id: itemId,
        path: itemPath,
        name: itemName
    };

    updateDisplay();

    highlightSelectedItem(category, itemId);
}

// Update the preview
function updateDisplay() {
    // Update base image
    if (mascotState.bases && mascotState.bases.path) {
        const baseImage = document.getElementById('selected-base-image');
        baseImage.src = mascotState.bases.path;
        baseImage.alt = mascotState.bases.name || 'Base Mascot';
    }

    // Update hair image
    updateSelectionTile('hair', 'selected-hair-image');

    // Update outfit image
    updateSelectionTile('outfits', 'selected-outfits-image');

    // Update accessories image
    updateSelectionTile('accessories', 'selected-accessories-image');

    // Update extras image
    updateSelectionTile('extras', 'selected-extras-image');
}

// Helper function to update a selection tile
function updateSelectionTile(category, imageId) {
    const image = document.getElementById(imageId);

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

// Function to highlight the selected item in each category
function highlightSelectedItem(category, itemId) {
    // Remove highlight from all items in the category
    document.querySelectorAll(`.item-option[data-category="${category}"]`).forEach(el => {
        el.classList.remove('selected');
    });

    // Add highlight to the selected item
    const selectedItem = document.querySelector(`.item-option[data-category="${category}"][data-item-id="${itemId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
}

// Function to randomize the mascot
function randomizeMascot() {
    // Get a random base
    const randomBase = getRandomItem('bases');
    if (randomBase) {
        selectItem('bases', randomBase.id, randomBase.path, randomBase.name);
    }

    // Optionally randomize other categories
    const randomHair = getRandomItem('hair');
    if (randomHair) {
        selectItem('hair', randomHair.id, randomHair.path, randomHair.name);
    }

    const randomOutfit = getRandomItem('outfits');
    if (randomOutfit) {
        selectItem('outfits', randomOutfit.id, randomOutfit.path, randomOutfit.name);
    }

    const randomAccessory = getRandomItem('accessories');
    if (randomAccessory) {
        selectItem('accessories', randomAccessory.id, randomAccessory.path, randomAccessory.name);
    }

    const randomExtra = getRandomItem('extras');
    if (randomExtra) {
        selectItem('extras', randomExtra.id, randomExtra.path, randomExtra.name);
    }
}

// Helper function to get a random item from a category
function getRandomItem(category) {
    const items = mascotAssets[category];
    if (!items || items.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

// Function to open the order modal
function openOrderModal() {
    // Check if a base mascot is selected
    if (!mascotState.bases) {
        alert('Please select a base mascot first!');
        return;
    }

    // Get the modal element
    const modal = document.getElementById('order-modal');

    // Update the summary preview with the current selections
    updateSummaryPreview();

    // Update the order details text
    updateOrderDetails();

    // Show the modal
    modal.style.display = 'flex';

    // Set up close button
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Set up cancel button
    document.getElementById('cancel-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Function to update the summary preview in the modal
function updateSummaryPreview() {
    // Update base image in summary
    if (mascotState.bases && mascotState.bases.path) {
        const summaryBaseImage = document.getElementById('summary-base-image');
        summaryBaseImage.src = mascotState.bases.path;
        summaryBaseImage.alt = mascotState.bases.name || 'Base Mascot';
    }

    // Update hair image in summary
    updateSummaryTile('hair', 'summary-hair-image', 'summary-hair-tile');

    // Update outfit image in summary
    updateSummaryTile('outfits', 'summary-outfits-image', 'summary-outfits-tile');

    // Update accessories image in summary
    updateSummaryTile('accessories', 'summary-accessories-image', 'summary-accessories-tile');

    // Update extras image in summary
    updateSummaryTile('extras', 'summary-extras-image', 'summary-extras-tile');
}

// Helper function to update a summary tile
function updateSummaryTile(category, imageId, tileId) {
    const image = document.getElementById(imageId);
    const tile = document.getElementById(tileId);

    if (mascotState[category] && mascotState[category].path) {
        image.src = mascotState[category].path;
        image.alt = mascotState[category].name || `Selected ${category}`;
        tile.style.display = 'block';
    } else {
        tile.style.display = 'none';
    }
}

// Function to update the order details text
function updateOrderDetails() {
    const detailsContainer = document.getElementById('order-details');

    // Find the names of selected items
    const baseName = findItemNameById('bases', mascotState.bases?.id) || 'None';
    const hairName = findItemNameById('hair', mascotState.hair?.id) || 'None';
    const outfitsName = findItemNameById('outfits', mascotState.outfits?.id) || 'None';
    const accessoriesName = findItemNameById('accessories', mascotState.accessories?.id) || 'None';
    const extrasName = findItemNameById('extras', mascotState.extras?.id) || 'None';

    // Create the HTML for the details
    detailsContainer.innerHTML = `
    <h3>Your Selections:</h3>
    <p><strong>Base Mascot:</strong> ${baseName}</p>
    <p><strong>Hairstyle:</strong> ${hairName}</p>
    <p><strong>Outfit:</strong> ${outfitsName}</p>
    <p><strong>Accessories:</strong> ${accessoriesName}</p>
    <p><strong>Special props:</strong> ${extrasName}</p>
  `;
}


// Function to handle form submission
function handleFormSubmission(e) {
    e.preventDefault();

    // Get form values
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const consent = document.getElementById('consent').checked;

    // Validate form (basic validation)
    if (!customerName || !customerEmail || !consent) {
        alert('Please fill in all required fields');
        return;
    }

    // Create order data object
    const orderData = {
        customer: {
            name: customerName,
            email: customerEmail,
            consent: consent
        },
        mascot: {
            base: {
                id: mascotState.bases?.id,
                name: findItemNameById('bases', mascotState.bases?.id)
            },
            hair: {
                id: mascotState.hair?.id,
                name: findItemNameById('hair', mascotState.hair?.id)
            },
            outfits: {
                id: mascotState.outfits?.id,
                name: findItemNameById('outfits', mascotState.outfits?.id)
            },
            accessories: {
                id: mascotState.accessories?.id,
                name: findItemNameById('accessories', mascotState.accessories?.id)
            },
            extras: {
                id: mascotState.extras?.id,
                name: findItemNameById('extras', mascotState.extras?.id)
            }
        }
    };

    // For MVP, log the data to console
    console.log('Order data:', orderData);

    // In a real implementation, you would send this data to a server
    // For now, we'll simulate a successful submission
    submitOrderData(orderData);
}

// Function to submit order data (simulated for MVP)
function submitOrderData(orderData) {
    // Simulate an API call with a timeout
    setTimeout(() => {
        // Hide the order modal
        document.getElementById('order-modal').style.display = 'none';

        // Show the thank you modal
        const thankYouModal = document.getElementById('thank-you-modal');
        document.getElementById('customer-email-display').textContent = orderData.customer.email;
        thankYouModal.style.display = 'flex';

        // Set up close button for thank you modal
        document.getElementById('close-thank-you').addEventListener('click', () => {
            thankYouModal.style.display = 'none';

            // Optionally reset the form and selections
            resetMascotBuilder();
        });
    }, 1000); // Simulate a 1-second delay for "processing"
}

// Function to reset the mascot builder after submission
function resetMascotBuilder() {
    // Clear the state
    mascotState.hair = null;
    mascotState.outfits = null;
    mascotState.accessories = null;
    mascotState.extras = null;

    // Keep the base mascot or select a new random one
    const randomBase = getRandomItem('bases');
    if (randomBase) {
        selectItem('bases', randomBase.id, randomBase.path, randomBase.name);
    }

    // Update the preview
    updateDisplay();

    // Reset the form
    document.getElementById('order-form').reset();
}

// Initialize the page
function initializePage() {
    // Load the base mascots first
    loadCategoryItems('bases');

    // Set up tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            btn.classList.add('active');
            // Load items for the selected category
            loadCategoryItems(btn.dataset.category);
        });
    });

    // Set up randomize button
    document.getElementById('randomize-btn').addEventListener('click', randomizeMascot);

    // Set up save design button
    document.getElementById('save-design-btn').addEventListener('click', openOrderModal);

    // Set up form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleFormSubmission);
    }
}

// Call initialize when the page loads
document.addEventListener('DOMContentLoaded', initializePage);