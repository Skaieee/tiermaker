// This file contains the JavaScript code for the tier list maker application.

document.addEventListener('DOMContentLoaded', () => {
    const tierListContainer = document.getElementById('tier-list-container');
    const addTierButton = document.getElementById('add-tier');
    const tierInput = document.getElementById('tier-input');

    let tiers = [];

    function renderTiers() {
        tierListContainer.innerHTML = '';
        tiers.forEach((tier, index) => {
            const tierDiv = document.createElement('div');
            tierDiv.className = 'tier';
            tierDiv.innerHTML = `
                <span>${tier}</span>
                <button class="remove-tier" data-index="${index}">Remove</button>
            `;
            tierListContainer.appendChild(tierDiv);
        });
        attachRemoveTierListeners();
    }

    function attachRemoveTierListeners() {
        const removeButtons = document.querySelectorAll('.remove-tier');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                tiers.splice(index, 1);
                renderTiers();
            });
        });
    }

    addTierButton.addEventListener('click', () => {
        const tierName = tierInput.value.trim();
        if (tierName) {
            tiers.push(tierName);
            tierInput.value = '';
            renderTiers();
        }
    });
});