document.addEventListener('DOMContentLoaded', () => {
    const tierTableBody = document.getElementById('tier-table-body');
    const addTierButton = document.getElementById('add-tier');
    const tierInput = document.getElementById('tier-input');
    const tierImageInput = document.getElementById('tier-image-input'); // Champ image

    const cardPool = document.getElementById('card-pool');
    const addCardButton = document.getElementById('add-card');
    const cardTextInput = document.getElementById('card-text-input');
    const cardImageInput = document.getElementById('card-image-input');

    let tiers = [];
    let cards = [];
    let tierCards = {}; // { tierIndex: [cardIndex, ...] }

    function renderTiers() {
        tierTableBody.innerHTML = '';
        tiers.forEach((tier, index) => {
            const row = document.createElement('tr');

            // Tier name or image + remove button in the same cell
            const nameCell = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-tier';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => {
                tiers.splice(index, 1);
                delete tierCards[index];
                // Re-index tierCards
                const newTierCards = {};
                Object.keys(tierCards).forEach(tierIdx => {
                    if (tierIdx < index) newTierCards[tierIdx] = tierCards[tierIdx];
                    else if (tierIdx > index) newTierCards[tierIdx - 1] = tierCards[tierIdx];
                });
                tierCards = newTierCards;
                renderTiers();
            });

            // If the tier is an image, create an img element
            if (tier.type === 'image') {
                const img = document.createElement('img');
                img.src = tier.content;
                img.alt = 'Tier image';
                img.style.width = '50px';
                img.style.height = '50px';
                nameCell.appendChild(img);
            } else {
                // Otherwise, just display the text content
                nameCell.textContent = tier.content;
            }

            // Add remove button to the same cell as the tier name/image
            nameCell.appendChild(removeBtn);
            row.appendChild(nameCell);

            // Cards cell
            const cardsCell = document.createElement('td');
            cardsCell.className = 'tier-cards';
            cardsCell.dataset.tierIndex = index;
            cardsCell.style.minHeight = '40px';
            cardsCell.style.display = 'flex';
            cardsCell.style.gap = '8px';
            cardsCell.style.flexWrap = 'wrap';

            (tierCards[index] || []).forEach(cardIdx => {
                cardsCell.appendChild(createCardElement(cards[cardIdx], cardIdx));
            });

            // Drag & drop for tier
            cardsCell.addEventListener('dragover', e => e.preventDefault());
            cardsCell.addEventListener('drop', e => {
                e.preventDefault();
                const cardIdx = e.dataTransfer.getData('cardIdx');
                moveCardToTier(cardIdx, index);
            });

            row.appendChild(cardsCell);

            tierTableBody.appendChild(row);
        });
    }

    addTierButton.addEventListener('click', () => {
        const tierName = tierInput.value.trim();
        const tierImageFile = tierImageInput.files[0];
        if (tierName || tierImageFile) {
            if (tierImageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    tiers.push({ type: 'image', content: e.target.result });
                    tierInput.value = '';
                    tierImageInput.value = '';
                    renderTiers();
                };
                reader.readAsDataURL(tierImageFile);
            } else {
                tiers.push({ type: 'text', content: tierName });
                tierInput.value = '';
                renderTiers();
            }
        }
    });

    // Cards
    function createCardElement(card, idx) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.draggable = true;
        cardDiv.dataset.cardIdx = idx;
        if (card.type === 'image') {
            const img = document.createElement('img');
            img.src = card.content;
            cardDiv.appendChild(img);
        }
        if (card.type === 'text') {
            cardDiv.appendChild(document.createTextNode(card.content));
        }
        cardDiv.addEventListener('dragstart', e => {
            e.dataTransfer.setData('cardIdx', idx);
        });
        return cardDiv;
    }

    function renderCardPool() {
        cardPool.innerHTML = '';
        cards.forEach((card, idx) => {
            // Only show cards not in any tier
            if (!Object.values(tierCards).flat().includes(idx)) {
                cardPool.appendChild(createCardElement(card, idx));
            }
        });
    }

    addCardButton.addEventListener('click', () => {
        const text = cardTextInput.value.trim();
        const file = cardImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                cards.push({ type: 'image', content: e.target.result });
                renderCardPool();
            };
            reader.readAsDataURL(file);
            cardImageInput.value = '';
            cardTextInput.value = '';
        } else if (text) {
            cards.push({ type: 'text', content: text });
            cardTextInput.value = '';
            renderCardPool();
        }
    });

    function moveCardToTier(cardIdx, tierIdx) {
        // Remove from all tiers
        Object.keys(tierCards).forEach(tier => {
            tierCards[tier] = (tierCards[tier] || []).filter(idx => idx != cardIdx);
        });
        // Add to this tier
        if (!tierCards[tierIdx]) tierCards[tierIdx] = [];
        tierCards[tierIdx].push(Number(cardIdx));
        renderTiers();
        renderCardPool();
    }

    // Initial render
    renderTiers();
    renderCardPool();
});
