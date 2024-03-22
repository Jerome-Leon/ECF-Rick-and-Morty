// Attendre que le DOM soit entièrement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function () {
    // Nombre de personnages à afficher
    const numCharacters = 12;
    // Tableaux pour stocker les personnages selon leur statut
    let tableDead = [];
    let tableAlive = [];
    let tableUnknown = [];
    // Tableau pour suivre les IDs des personnages déjà affichés
    let displayedCharacterIds = [];

    // Fonction pour récupérer les personnages depuis l'API
    function getCharactersFromAPI() {
        // Récupérer les données de la première page de l'API
        fetch(`https://rickandmortyapi.com/api/character/?page=1`)
            .then(response => response.json())
            .then(data => {
                // Parcourir tous les personnages de la première page
                const promises = [];
                for (let i = 1; i <= data.info.count; i++) {
                    // Récupérer les données d'un personnage spécifique
                    const characterPromise = fetch(`https://rickandmortyapi.com/api/character/${i}`)
                        .then(response => response.json())
                        .then(characterData => {
                            // Créer un objet avec les informations du personnage
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

                            // Classifier le personnage en fonction de son statut
                            if (status === "Dead") {
                                tableDead.push(characterInfo);
                            } else if (status === "Alive") {
                                tableAlive.push(characterInfo);
                            } else {
                                tableUnknown.push(characterInfo);
                            }
                        })
                        .catch(error => console.error("Error fetching character:", error));

                    promises.push(characterPromise);
                }

                // Une fois que toutes les promesses sont résolues, sélectionner un ensemble aléatoire de personnages
                Promise.all(promises).then(() => {
                    const selectedCharacters = selectRandomCharacters(tableDead.concat(tableAlive, tableUnknown));
                    // Afficher les cartes de ces personnages
                    displayCharacterCards(selectedCharacters);
                });
            })
            .catch(error => console.error("Error fetching characters:", error));
    }

    // Fonction pour sélectionner un nombre aléatoire de personnages
    function selectRandomCharacters(charactersArray) {
        let selectedCharacters = [];

        while (selectedCharacters.length < numCharacters) {
            let randomIndex = Math.floor(Math.random() * charactersArray.length);
            let randomCharacter = charactersArray[randomIndex];

            if (!displayedCharacterIds.includes(randomCharacter.id)) {
                selectedCharacters.push(randomCharacter);
                displayedCharacterIds.push(randomCharacter.id);
            }
        }

        return selectedCharacters;
    }

    // Fonction pour afficher les cartes des personnages
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

            // Ajouter un écouteur d'événement pour afficher les détails du personnage dans un modal
            article.addEventListener('click', () => {
                const modalContent = `
                    <img src="${character.image}" alt="character" class="modal__img">
                    <div class="modal__details">
                        <h2 class="modal__title">${character.name}</h2>
                        <p class="modal__origin">Origin: ${character.origin}</p>
                        <p class="modal__location">Location: ${character.location}</p>
                        <p class="modal__episodes">Seen in the episodes :</p>
                        <ul>
                            ${character.episodes.map(episode => {
                                // Extraire le numéro d'épisode à partir de l'URL
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

        // Ajouter un écouteur d'événement de scroll pour activer l'effet de hover
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

    }

    // Fonction pour ouvrir un modal avec le contenu spécifié
    function openModal(content) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalBody = document.getElementById('modalBody');

        if (!modalOverlay || !modalBody) return; // Ajout d'une vérification

        // Injecter le contenu dans le modal
        modalBody.innerHTML = content;
        // Afficher le modal
        modalOverlay.style.display = 'flex';

        // Ajouter un écouteur d'événement pour fermer le modal
        const modalClose = document.getElementById('modalClose');
        modalClose.addEventListener('click', closeModal);

        // Fermer le modal si l'utilisateur clique en dehors du contenu
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }
    // Fonction pour fermer le modal
    function closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.style.display = 'none';
    }

    // Appeler la fonction pour récupérer les personnages au chargement de la page
    getCharactersFromAPI();

    // Sélectionner le bouton "12 nouveaux personnages" s'il existe
    const new12Button = document.getElementById('new12');
    // Ajouter un écouteur d'événement pour recharger 12 nouveaux personnages
    if (new12Button) {
        new12Button.addEventListener('click', () => {
            // Réinitialiser les IDs des personnages déjà affichés
            displayedCharacterIds = [];
            // Sélectionner et afficher 12 nouveaux personnages aléatoires parmi tous
            const selectedCharacters = selectRandomCharacters(tableDead.concat(tableAlive, tableUnknown));
            displayCharacterCards(selectedCharacters);
        });
    };

    // Sélectionner le bouton "Morts" s'il existe
    const deadOnesButton = document.getElementById('dead__ones');
    // Ajouter un écouteur d'événement pour afficher des personnages morts
    if (deadOnesButton) {
        deadOnesButton.addEventListener('click', () => {
            // Réinitialiser les IDs des personnages déjà affichés
            displayedCharacterIds = [];
            // Sélectionner et afficher des personnages morts aléatoires
            const selectedCharacters = selectRandomCharacters(tableDead);
            displayCharacterCards(selectedCharacters);
        });
    };

    // Sélectionner le bouton "Vivants" s'il existe
    const livingOnesButton = document.getElementById('living__ones');
    // Ajouter un écouteur d'événement pour afficher des personnages vivants
    if (livingOnesButton) {
        livingOnesButton.addEventListener('click', () => {
            // Réinitialiser les IDs des personnages déjà affichés
            displayedCharacterIds = [];
            // Sélectionner et afficher des personnages vivants aléatoires
            const selectedCharacters = selectRandomCharacters(tableAlive);
            displayCharacterCards(selectedCharacters);
        });
    };

    // Sélectionner le bouton "Inconnus" s'il existe
    const unknownOnesButton = document.getElementById('unknown__ones');
    // Ajouter un écouteur d'événement pour afficher des personnages avec un statut inconnu
    if (unknownOnesButton) {
        unknownOnesButton.addEventListener('click', () => {
            // Réinitialiser les IDs des personnages déjà affichés
            displayedCharacterIds = [];
            // Sélectionner et afficher des personnages avec un statut inconnu aléatoires
            const selectedCharacters = selectRandomCharacters(tableUnknown);
            displayCharacterCards(selectedCharacters);
        });
    };

    // Fonction pour intercepter l'événement de pression longue sur l'image
    function preventImageContextMenu(e) {
        // Empêcher le comportement par défaut (ouverture du menu contextuel)
        e.preventDefault();
    }

    // Ajouter un écouteur d'événement de pression longue sur chaque image
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        image.addEventListener('touchstart', preventImageContextMenu);
    });


    // Sélectionner tous les boutons de commutation
    const buttons = document.querySelectorAll('.switch__buttons button');

    // Fonction pour ajouter une classe d'animation de halo au clic sur un bouton
    function handleClick() {
        // Ajouter la classe pour l'animation de halo
        this.classList.add('halo-click-animation');

        // Supprimer la classe après 3 secondes
        setTimeout(() => {
            this.classList.remove('halo-click-animation');
        }, 3000); // 3 secondes en millisecondes
    }

    // Ajouter un écouteur d'événement à chaque bouton pour l'animation de halo
    buttons.forEach(button => {
        button.addEventListener('click', handleClick);
    });

});