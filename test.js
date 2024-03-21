document.addEventListener("DOMContentLoaded", function () {
    const numCharacters = 12;
    let tableDead = [];
    let tableAlive = [];
    let tableUnknown = [];
    let displayedCharacterIds = [];

    async function getCharactersFromAPI() {
        try {
            const response = await fetch(`https://rickandmortyapi.com/api/character/?page=1`);
            const data = await response.json();

            for (let i = 1; i <= data.info.count; i++) {
                const character = await fetch(`https://rickandmortyapi.com/api/character/${i}`);
                const characterData = await character.json();

                let status = characterData.status;
                let characterInfo = {
                    id: characterData.id,
                    name: characterData.name,
                    status: status,
                    image: characterData.image,
                    gender: characterData.gender,
                    species: characterData.species,
                    origin: characterData.origin.name,
                    location: characterData.location.name,
                    episodes: characterData.episode // Array of episode URLs
                };

                if (status === "Dead") {
                    tableDead.push(characterInfo);
                } else if (status === "Alive") {
                    tableAlive.push(characterInfo);
                } else {
                    tableUnknown.push(characterInfo);
                };
            };

            const selectedCharacters = selectRandomCharacters(tableDead.concat(tableAlive, tableUnknown));
            displayCharacterCards(selectedCharacters);
        } catch (error) {
            console.error("Error fetching characters:", error);
        };
    };

    function selectRandomCharacters(charactersArray) {
        let selectedCharacters = [];

        while (selectedCharacters.length < numCharacters) {
            let randomIndex = Math.floor(Math.random() * charactersArray.length);
            let randomCharacter = charactersArray[randomIndex];

            if (!displayedCharacterIds.includes(randomCharacter.id)) {
                selectedCharacters.push(randomCharacter);
                displayedCharacterIds.push(randomCharacter.id);
            };
        };

        return selectedCharacters;
    };

    function displayCharacterCards(characters) {
        const cardContainer = document.querySelector('.card__container');
        cardContainer.innerHTML = '';

        characters.forEach(character => {
            const article = document.createElement('article');
            article.className = 'card__article';
            article.innerHTML = `
                <img src="${character.image}" alt="character" class="card__img">
                <div class="card__data">
                    <h2 class="card__title">${character.name}</h2>
                    <span class="card__status">Status: ${character.status}</span>
                    <p class="card__gender">Gender: ${character.gender}</p>
                    <p class="card__species">Species: ${character.species}</p>
                </div>
            `;

            article.addEventListener('click', () => {
                const modalContent = `
                    <img src="${character.image}" alt="character" class="modal__img">
                    <div class="modal__details">
                        <h2 class="modal__title">${character.name}</h2>
                        <p class="modal__origin">Origin: ${character.origin}</p>
                        <p class="modal__location">Location: ${character.location}</p>
                        <p class="modal__episodes">Episodes:</p>
                        <ul>
                            ${character.episodes.map(episode => {
                    // Extract episode number from URL
                    const episodeNumber = episode.split('/').pop();
                    return `<li>Episode ${episodeNumber}</li>`;
                }).join('')}
                        </ul>
                    </div>
                `;
                openModal(modalContent);
            });

            cardContainer.appendChild(article);
        });
        // Ajouter un écouteur d'événement de scroll
        window.addEventListener('scroll', () => {
            const cardDataElements = document.querySelectorAll('.card__data');

            // Vérifier chaque élément .card__data
            cardDataElements.forEach(cardData => {
                // Vérifier si l'élément est dans la vue (partiellement)
                if (isElementInViewport(cardData)) {
                    // Ajouter la classe hover pour activer l'effet
                    cardData.classList.add('auto-hover');
                } else {
                    // Si l'élément sort de la vue, retirer la classe hover
                    cardData.classList.remove('auto-hover');
                }
            });
        });

        // Fonction pour vérifier si un élément est dans la vue
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

    };
    console.log(tableDead);
    function openModal(content) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalBody = document.getElementById('modalBody');

        if (!modalOverlay || !modalBody) return; // Ajout d'une vérification

        modalBody.innerHTML = content;
        modalOverlay.style.display = 'flex';

        const modalClose = document.getElementById('modalClose');
        modalClose.addEventListener('click', closeModal);

        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }

    function closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.style.display = 'none';
    }

    getCharactersFromAPI();

    const new12Button = document.getElementById('new12');
    if (new12Button) {
        new12Button.addEventListener('click', () => {
            displayedCharacterIds = [];
            const selectedCharacters = selectRandomCharacters(tableDead.concat(tableAlive, tableUnknown));
            displayCharacterCards(selectedCharacters);
        });
    };

    const deadOnesButton = document.getElementById('dead__ones');
    if (deadOnesButton) {
        deadOnesButton.addEventListener('click', () => {
            displayedCharacterIds = [];
            const selectedCharacters = selectRandomCharacters(tableDead);
            displayCharacterCards(selectedCharacters);
        });
    };

    const livingOnesButton = document.getElementById('living__ones');
    if (livingOnesButton) {
        livingOnesButton.addEventListener('click', () => {
            displayedCharacterIds = [];
            const selectedCharacters = selectRandomCharacters(tableAlive);
            displayCharacterCards(selectedCharacters);
        });
    };

    const unknownOnesButton = document.getElementById('unknown__ones');
    if (unknownOnesButton) {
        unknownOnesButton.addEventListener('click', () => {
            displayedCharacterIds = [];
            const selectedCharacters = selectRandomCharacters(tableUnknown);
            displayCharacterCards(selectedCharacters);
        });
    };
    // Sélectionnez tous les boutons
    const buttons = document.querySelectorAll('.switch__buttons button');

    // Fonction pour ajouter la classe et supprimer après 3 secondes
    function handleClick() {
        // Ajouter la classe pour l'animation accélérée
        this.classList.add('halo-click-animation');

        // Supprimer la classe après 3 secondes
        setTimeout(() => {
            this.classList.remove('halo-click-animation');
        }, 3000); // 3 secondes en millisecondes
    }

    // Ajouter un écouteur d'événement à chaque bouton
    buttons.forEach(button => {
        button.addEventListener('click', handleClick);
    });

});
