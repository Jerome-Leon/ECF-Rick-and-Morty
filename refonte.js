function shuffle(array) {
    // Algorithme de Fisher-Yates pour mélanger un tableau
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayCharacterCards(characters) {
    const cardContainer = document.querySelector('.card__container');
    cardContainer.innerHTML = '';

    characters.forEach(character => {
        const article = document.createElement('article');
        article.className = 'card__article';
        article.dataset.origin = character.origin.name; // Ajout de l'origine du personnage aux données de la carte
        article.dataset.location = character.location.name; // Ajout de la location du personnage aux données de la carte
        article.dataset.episodes = getEpisodeList(character.episode); // Appel de la fonction pour obtenir la liste des épisodes

        // Ajout de l'élément (💀) si le statut du personnage est "Dead"
        const statusIcon = character.status === 'Dead' ? ' 💀' : '';

        article.innerHTML = `
            <img src="${character.image}" alt="character" class="card__img">
            <div class="card__data">
                <h2 class="card__title">${character.name}</h2>
                <span class="card__status">Status : ${character.status}${statusIcon}</span>
                <p class="card__gender">Gender : ${character.gender}</p>
                <p class="card__species">Species : ${character.species}</p>
            </div>
        `;
        cardContainer.appendChild(article);
    });
}

function getEpisodeList(episodes) {
    const episodeCount = episodes.length;
    let episodeList = episodes.map(episode => episode.split('/').pop());

    if (episodeCount === 1) {
        return `Episode : ${episodeList[0]}`;
    } else {
        if (episodeCount > 1) {
            const lastEpisode = episodeList.pop();
            episodeList = `${episodeList.join(', ')} and ${lastEpisode}`;
        }
        return `Episodes : ${episodeList}`;
    }
}

async function getAllCharacterIds() {
    const response = await fetch('https://rickandmortyapi.com/api/character/');
    const data = await response.json();
    const allCharacterIds = [];

    // Boucle pour parcourir toutes les pages et récupérer les IDs
    for (let page = 1; page <= data.info.pages; page++) {
        const pageResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const pageData = await pageResponse.json();
        const pageCharacterIds = pageData.results.map(character => character.id);
        allCharacterIds.push(...pageCharacterIds);
    }

    return allCharacterIds;
}

async function getNewRandomCharacters() {
    const allCharacterIds = await getAllCharacterIds();

    // Sélectionner aléatoirement 12 IDs parmi tous les IDs disponibles
    const randomIds = [];
    while (randomIds.length < 12) {
        const randomIndex = Math.floor(Math.random() * allCharacterIds.length);
        const randomId = allCharacterIds[randomIndex];
        if (!randomIds.includes(randomId)) {
            randomIds.push(randomId);
        }
    }

    // Récupérer les détails des nouveaux personnages sélectionnés en une seule requête
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomIds.join(',')}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const characters = await response.json();

    console.log("Nouveaux 12 personnages sélectionnés :", characters);

    // Afficher les cartes après les avoir mélangées
    const shuffledCharacters = shuffle(characters);
    displayCharacterCards(shuffledCharacters);

    return characters;
}

async function getRandomDeadCharacters() {
    const allCharacterIds = await getAllCharacterIds();

    // Filtrer les personnages avec le statut "dead"
    const deadCharacterIds = [];
    for (let page = 1; page <= Math.ceil(allCharacterIds.length / 20); page++) {
        const pageResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const pageData = await pageResponse.json();
        const deadCharactersInPage = pageData.results.filter(character => character.status === 'Dead');
        deadCharacterIds.push(...deadCharactersInPage.map(character => character.id));
    }

    // Sélectionner aléatoirement 12 IDs parmi les IDs de personnages "dead"
    const randomDeadIds = [];
    while (randomDeadIds.length < 12) {
        const randomIndex = Math.floor(Math.random() * deadCharacterIds.length);
        const randomId = deadCharacterIds[randomIndex];
        if (!randomDeadIds.includes(randomId)) {
            randomDeadIds.push(randomId);
        }
    }

    // Récupérer les détails des personnages "dead" sélectionnés en une seule requête
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomDeadIds.join(',')}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const characters = await response.json();

    console.log("12 personnages 'dead' sélectionnés :", characters);

    // Afficher les cartes après les avoir mélangées
    const shuffledCharacters = shuffle(characters);
    displayCharacterCards(shuffledCharacters);

    return characters;
}

async function getRandomAliveCharacters() {
    const allCharacterIds = await getAllCharacterIds();

    // Filtrer les personnages avec le statut "alive"
    const aliveCharacterIds = [];
    for (let page = 1; page <= Math.ceil(allCharacterIds.length / 20); page++) {
        const pageResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const pageData = await pageResponse.json();
        const aliveCharactersInPage = pageData.results.filter(character => character.status === 'Alive');
        aliveCharacterIds.push(...aliveCharactersInPage.map(character => character.id));
    }

    // Sélectionner aléatoirement 12 IDs parmi les IDs de personnages "alive"
    const randomAliveIds = [];
    while (randomAliveIds.length < 12) {
        const randomIndex = Math.floor(Math.random() * aliveCharacterIds.length);
        const randomId = aliveCharacterIds[randomIndex];
        if (!randomAliveIds.includes(randomId)) {
            randomAliveIds.push(randomId);
        }
    }

    // Récupérer les détails des personnages "alive" sélectionnés en une seule requête
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomAliveIds.join(',')}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const characters = await response.json();

    console.log("12 personnages 'alive' sélectionnés :", characters);

    // Afficher les cartes après les avoir mélangées
    const shuffledCharacters = shuffle(characters);
    displayCharacterCards(shuffledCharacters);

    return characters;
}

async function getRandomUnknownStatusCharacters() {
    const allCharacterIds = await getAllCharacterIds();

    // Filtrer les personnages avec le statut "unknown"
    const unknownCharacterIds = [];
    for (let page = 1; page <= Math.ceil(allCharacterIds.length / 20); page++) {
        const pageResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const pageData = await pageResponse.json();
        const unknownCharactersInPage = pageData.results.filter(character => character.status === 'unknown');
        unknownCharacterIds.push(...unknownCharactersInPage.map(character => character.id));
    }

    // Sélectionner aléatoirement 12 IDs parmi les IDs de personnages "unknown"
    const randomUnknownIds = [];
    while (randomUnknownIds.length < 12) {
        const randomIndex = Math.floor(Math.random() * unknownCharacterIds.length);
        const randomId = unknownCharacterIds[randomIndex];
        if (!randomUnknownIds.includes(randomId)) {
            randomUnknownIds.push(randomId);
        }
    }

    // Récupérer les détails des personnages "unknown" sélectionnés en une seule requête
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomUnknownIds.join(',')}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const characters = await response.json();

    console.log("12 personnages 'unknown' sélectionnés :", characters);

    // Afficher les cartes après les avoir mélangées
    const shuffledCharacters = shuffle(characters);
    displayCharacterCards(shuffledCharacters);

    return characters;
}

// Fonction pour vérifier si un élément est visible à l'écran
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Fonction pour ouvrir les card__data des articles visibles
function openVisibleCardData() {
    const articles = document.querySelectorAll('.card__article');
    articles.forEach(article => {
        const data = article.querySelector('.card__data');
        if (isElementInViewport(article)) {
            data.classList.add('open');
        } else {
            data.classList.remove('open');
        }
    });
}

// Écoute de l'événement de scroll
window.addEventListener('scroll', () => {
    openVisibleCardData();
});

// Appeler la fonction au chargement de la page pour afficher les premiers 12 personnages
window.onload = async () => {
    await getNewRandomCharacters();
    openVisibleCardData(); // Ouvrir ceux visibles dès le chargement
};

// Appeler la fonction pour obtenir de nouveaux personnages quand le bouton "new12" est cliqué
document.getElementById('new12').addEventListener('click', async () => {
    await getNewRandomCharacters();
});

// Appeler la fonction pour obtenir les personnages "dead" quand le bouton "dead__ones" est cliqué
document.getElementById('dead__ones').addEventListener('click', async () => {
    await getRandomDeadCharacters();
});

// Appeler la fonction pour obtenir les personnages "alive" quand le bouton "living__ones" est cliqué
document.getElementById('living__ones').addEventListener('click', async () => {
    await getRandomAliveCharacters();
});

// Appeler la fonction pour obtenir les personnages "dead" quand le bouton "unknown__ones" est cliqué
document.getElementById('unknown__ones').addEventListener('click', async () => {
    await getRandomUnknownStatusCharacters();
});

/// Fonction pour ouvrir la modale
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Empêcher le défilement de la page sous la modale
}

// Fonction pour fermer la modale
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'none';
    document.body.style.overflow = ''; // Rétablir le défilement de la page
}

// Gestionnaire d'événement pour ouvrir la modale au clic sur une carte
document.addEventListener('click', function (event) {
    const clickedArticle = event.target.closest('.card__article');
    if (clickedArticle) {
        openModal();

        // Contenu de la modale
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <img src="${clickedArticle.querySelector('.card__img').src}" alt="character" class="modal__img">
            <h2 class="modal__title">${clickedArticle.querySelector('.card__title').textContent}</h2>
            <p class="modal__origin">Origin : ${clickedArticle.dataset.origin}</p>
            <p class="modal__location">Location : ${clickedArticle.dataset.location}</p>
            <p class="modal__episodes">${clickedArticle.dataset.episodes}</p>
        `;
    }
});

// Gestionnaire d'événement pour fermer la modale au clic sur le bouton de fermeture
document.getElementById('modalClose').addEventListener('click', closeModal);

// Gestionnaire d'événement pour fermer la modale en cliquant en dehors de celle-ci
window.addEventListener('click', function (event) {
    const modalOverlay = document.getElementById('modalOverlay');
    if (event.target === modalOverlay) {
        closeModal();
    }
});

