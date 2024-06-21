document.addEventListener('DOMContentLoaded', async function() {
    const cardContainer = document.getElementById('card-container');
    const username = new URLSearchParams(window.location.search).get('username');

    if (!username) {
        showError('Username is not provided in the URL.');
        return;
    }

    try {
        const userLeagues = await fetchLeagues(username);
        renderLeagueCards(userLeagues, cardContainer, username);
    } catch (error) {
        showError('There was an error fetching leagues.', error);
    }
});

async function fetchLeagues(username) {
    const response = await fetch(`/getLeague?username=${username}`, { cache: "no-cache" });
    if (!response.ok) {
        throw new Error(`Failed to fetch leagues. Status: ${response.status}`);
    }
    return response.json();
}

function renderLeagueCards(userLeagues, cardContainer, username) {
    const leagues = userLeagues[0] || [];

    if (leagues.length === 0) {
        renderCreateLeagueCard(cardContainer, username, true);
    } else {
        leagues.forEach(league => {
            league.buttonText = 'View League';
            league.url = `/home?username=${username}`;
            cardContainer.appendChild(createCard(league, cardContainer, username));
        });

        if (leagues.length < 3) {
            renderCreateLeagueCard(cardContainer, username, false);
        }
    }
}

function renderCreateLeagueCard(cardContainer, username, isNoLeagues) {
    const createLeagueCardData = {
        title: isNoLeagues ? 'No Leagues Found' : 'Create New League',
        description: isNoLeagues ? 'You are not in any league.' : 'You can create a new league.',
        buttonText: 'Create League'
    };
    cardContainer.appendChild(createCard(createLeagueCardData, cardContainer, username));
}

function createCard(cardData, cardContainer, username) {
    const card = document.createElement('div');
    card.classList.add('card');

    if (!isCreateLeagueCard(cardData)) {
        addDeleteButton(card, cardData, cardContainer);
    }

    addCardContent(card, cardData);
    addButton(card, cardData, username);

    return card;
}

function isCreateLeagueCard(cardData) {
    return cardData.description === 'You can create a new league.' || cardData.description === 'You are not in any league.';
}

function addDeleteButton(card, cardData, cardContainer) {
    const deleteIcon = document.createElement('span');
    deleteIcon.textContent = '❌';
    deleteIcon.classList.add('delete-icon');
    deleteIcon.addEventListener('click', () => {
        cardContainer.removeChild(card);
        fetch(`/deleteLeague?portfolio_id=${cardData.portfolio_id}`, { method: 'DELETE' });
    });
    card.appendChild(deleteIcon);
}

function addCardContent(card, cardData) {
    if (cardData.imgSrc) {
        const img = document.createElement('img');
        img.src = cardData.imgSrc;
        img.alt = cardData.portfolio_name;
        card.appendChild(img);
    }

    const title = document.createElement('h3');
    title.textContent = cardData.portfolio_name;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = cardData.description;
    card.appendChild(description);
}

function addButton(card, cardData, username) {
    const button = document.createElement('button');
    button.textContent = cardData.buttonText;
    button.addEventListener('click', () => {
        if (isCreateLeagueCard(cardData)) {
            showCreateLeagueForm(card, username);
        } else if (cardData.url) {
            getPortfolio(cardData);
        }
    });
    card.appendChild(button);
}

function showCreateLeagueForm(card, username) {
    card.querySelector('button').style.display = 'none';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter league name';
    card.appendChild(inputField);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', () => createLeague(inputField.value, username));
    card.appendChild(submitButton);
}

function getPortfolio(cardData) {
    if (cardData.url) {
        const url = new URL(cardData.url, window.location.origin);
        url.searchParams.append('portfolio_name', cardData.portfolio_name);
        window.location.href = url.toString();
    }
}

async function createLeague(leagueName, username) {
    if (!leagueName.trim()) {
        showError('Please enter a league name.');
        return;
    }

    try {
        const userLeagues = await fetchLeagues(username);
        if (userLeagues[0].length >= 3) {
            showError('You have reached the maximum number of leagues.');
            return;
        }

        const response = await fetch('/createLeague', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leagueName, username })
        });

        const createLeagueData = await response.json();
        console.log('League created:', createLeagueData);
        alert(`League created: ${leagueName}`);

        // Refresh the page to show the new league
        location.reload();
    } catch (error) {
        showError('There was an error creating the league.', error);
    }
}

function showError(message, error) {
    console.error(message, error);
    alert(message);
}