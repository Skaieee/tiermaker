// This file contains the JavaScript code for the tier list maker application.
// It handles the logic for creating and managing the tier lists, including event listeners and DOM manipulation.

document.addEventListener('DOMContentLoaded', () => {
    const tierListContainer = document.getElementById('tier-list-container');
    const addItemButton = document.getElementById('add-item-button');
    const itemInput = document.getElementById('item-input');

    addItemButton.addEventListener('click', () => {
        const itemName = itemInput.value.trim();
        if (itemName) {
            addItemToTierList(itemName);
            itemInput.value = '';
        }
    });

    function addItemToTierList(itemName) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('tier-item');
        itemElement.textContent = itemName;
        tierListContainer.appendChild(itemElement);
    }
});