// Function to fetch all character IDs from the API
async function getAllCharacterIds() {
    const response = await fetch('https://rickandmortyapi.com/api/character/');
    const data = await response.json();
    const allCharacterIds = [];

    // Loop through all pages to collect IDs
    for (let page = 1; page <= data.info.pages; page++) {
        const pageResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const pageData = await pageResponse.json();
        const pageCharacterIds = pageData.results.map(character => character.id);
        allCharacterIds.push(...pageCharacterIds);
    }

    return allCharacterIds;
}

// Function to shuffle an array using the Fisher-Yates algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to display character cards on the webpage
function displayCharacterCards(characters) {
    const cardContainer = document.querySelector('.card__container');
    cardContainer.innerHTML = '';

    characters.forEach(character => {
        const article = document.createElement('article');
        article.className = 'card__article';
        article.dataset.origin = character.origin.name; // Adding character origin to the card data
        article.dataset.location = character.location.name; // Adding character location to the card data
        article.dataset.episodes = getEpisodeList(character.episode); // Calling function to get episode list

        // Adding (💀) if character status is "Dead"
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

// Function to get formatted episode list
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

// Function to open the modal
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling of the page behind the modal
}

// Function to close the modal
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling of the page
}

// Function to check if an element is visible on the screen
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to open the card data of visible articles
function openVisibleCardData() {
    const articles = document.querySelectorAll('.card__article');
    let isOpened = false; // Variable to check if a card data is open

    articles.forEach(article => {
        const data = article.querySelector('.card__data');
        if (isElementInViewport(article)) {
            if (!isOpened) {
                data.classList.add('open');
                isOpened = true;
            } else {
                data.classList.remove('open');
            }
        } else {
            data.classList.remove('open');
        }
    });
}

// Function to get 12 new random characters
async function getNewRandomCharacters() {
    const allCharacterIds = await getAllCharacterIds();

    // Randomly select 12 IDs from all available IDs
    const randomIds = [];
    while (randomIds.length < 12) {
        const randomIndex = Math.floor(Math.random() * allCharacterIds.length);
        const randomId = allCharacterIds[randomIndex];
        if (!randomIds.includes(randomId)) {
            randomIds.push(randomId);
        }
    }

    // Fetch details of the selected new characters in a single request
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomIds.join(',')}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const characters = await response.json();

    console.log("New 12 selected characters:", characters);

    // Shuffle and display the cards
    const shuffledCharacters = shuffle(characters);
    displayCharacterCards(shuffledCharacters);

    return characters;
}

// Function to get 12 random dead characters
async function getRandomDeadCharacters() {
    const allCharacterIds = await getAllCharacterIds();

    // Filter characters with "dead" status
    const deadCharacterIds = [];
    for (let page = 1; page <= Math.ceil(allCharacterIds.length / 20); page++) {
        const pageResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const pageData = await pageResponse.json();
        const deadCharactersInPage = pageData.results.filter(character => character.status === 'Dead');
        deadCharacterIds.push(...deadCharactersInPage.map(character => character.id));
    }

    // Randomly select 12 IDs from dead character IDs
    const randomDeadIds = [];
    while (randomDeadIds.length < 12) {
        const randomIndex = Math.floor(Math.random() * deadCharacterIds.length);
        const randomId = deadCharacterIds[randomIndex];
        if (!randomDeadIds.includes(randomId)) {
            randomDeadIds.push(randomId);
        }
    }

    // Fetch details of the selected dead characters in a single request
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomDeadIds.join(',')}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const characters = await response.json();

    console.log("12 'dead' characters selected:", characters);

    // Shuffle and display the cards
    const shuffledCharacters = shuffle(characters);
    displayCharacterCards(shuffledCharacters);

    return characters;
}

// Function to get 12 random alive characters
async function getRandomAliveCharacters() {
    const allCharacterIds = await getAllCharacterIds();

    // Filter characters with "alive" status
    const aliveCharacterIds = [];
    for (let page = 1; page <= Math.ceil(allCharacterIds.length / 20); page++) {
        const pageResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const pageData = await pageResponse.json();
        const aliveCharactersInPage = pageData.results.filter(character => character.status === 'Alive');
        aliveCharacterIds.push(...aliveCharactersInPage.map(character => character.id));
    }

    // Randomly select 12 IDs from alive character IDs
    const randomAliveIds = [];
    while (randomAliveIds.length < 12) {
        const randomIndex = Math.floor(Math.random() * aliveCharacterIds.length);
        const randomId = aliveCharacterIds[randomIndex];
        if (!randomAliveIds.includes(randomId)) {
            randomAliveIds.push(randomId);
        }
    }

    // Fetch details of the selected alive characters in a single request
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomAliveIds.join(',')}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const characters = await response.json();

    console.log("12 'alive' characters selected:", characters);

    // Shuffle and display the cards
    const shuffledCharacters = shuffle(characters);
    displayCharacterCards(shuffledCharacters);

    return characters;
}

// Function to get 12 random characters with "unknown" status
async function getRandomUnknownStatusCharacters() {
    const allCharacterIds = await getAllCharacterIds();

    // Filter characters with "unknown" status
    const unknownCharacterIds = [];
    for (let page = 1; page <= Math.ceil(allCharacterIds.length / 20); page++) {
        const pageResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const pageData = await pageResponse.json();
        const unknownCharactersInPage = pageData.results.filter(character => character.status === 'unknown');
        unknownCharacterIds.push(...unknownCharactersInPage.map(character => character.id));
    }

    // Randomly select 12 IDs from unknown status character IDs
    const randomUnknownIds = [];
    while (randomUnknownIds.length < 12) {
        const randomIndex = Math.floor(Math.random() * unknownCharacterIds.length);
        const randomId = unknownCharacterIds[randomIndex];
        if (!randomUnknownIds.includes(randomId)) {
            randomUnknownIds.push(randomId);
        }
    }

    // Fetch details of the selected characters with "unknown" status in a single request
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomUnknownIds.join(',')}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const characters = await response.json();

    console.log("12 'unknown' characters selected:", characters);

    // Shuffle and display the cards
    const shuffledCharacters = shuffle(characters);
    displayCharacterCards(shuffledCharacters);

    return characters;
}

// Function to open the card data of visible articles
function openVisibleCardData() {
    const articles = document.querySelectorAll('.card__article');
    let isOpened = false; // Variable to check if a card data is open

    articles.forEach(article => {
        const data = article.querySelector('.card__data');
        if (isElementInViewport(article)) {
            if (!isOpened) {
                data.classList.add('open');
                isOpened = true;
            } else {
                data.classList.remove('open');
            }
        } else {
            data.classList.remove('open');
        }
    });
}

// Event listener for scroll event to open visible card data
window.addEventListener('scroll', () => {
    openVisibleCardData();
});

// Event handler to open the modal when clicking on a card
document.addEventListener('click', function (event) {
    const clickedArticle = event.target.closest('.card__article');
    if (clickedArticle) {
        openModal();

        // Modal content
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

// Event handler to close the modal when clicking the close button
document.getElementById('modalClose').addEventListener('click', closeModal);

// Event handler to close the modal when clicking outside of it
window.addEventListener('click', function (event) {
    const modalOverlay = document.getElementById('modalOverlay');
    if (event.target === modalOverlay) {
        closeModal();
    }
});

// Call the function when the page loads to display the first 12 characters
window.onload = async () => {
    await getNewRandomCharacters();
    openVisibleCardData(); // Open visible ones on load
};

// Event listener for "new12" button click to get new 12 characters
document.getElementById('new12').addEventListener('click', async () => {
    await getNewRandomCharacters();
});

// Event listener for "dead__ones" button click to get random 12 dead characters
document.getElementById('dead__ones').addEventListener('click', async () => {
    await getRandomDeadCharacters();
});

// Event listener for "living__ones" button click to get random 12 alive characters
document.getElementById('living__ones').addEventListener('click', async () => {
    await getRandomAliveCharacters();
});

// Event listener for "unknown__ones" button click to get random 12 characters with unknown status
document.getElementById('unknown__ones').addEventListener('click', async () => {
    await getRandomUnknownStatusCharacters();
});
