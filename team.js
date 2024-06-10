document.addEventListener('DOMContentLoaded', async function() {  // Make the function async
    const cardContainer = document.getElementById('card-container');
    const username = new URLSearchParams(window.location.search).get('username');

    try {
        const getLeagueResponse = await fetch(`/getLeague?username=${username}`, {
            cache: "no-cache"  // This can help bypass caching for debugging
        });

        if (!getLeagueResponse.ok) {
            throw new Error(`Failed to fetch leagues. Status: ${getLeagueResponse.status}`);
        }

        const userLeagues = await getLeagueResponse.json();
        console.log(userLeagues);

        if (userLeagues[0].length === 0) {
            const createLeagueCardData = {
                title: 'No Leagues Found',
                description: 'You are not in any league.',
                buttonText: 'Create League'
            };
            const createLeagueCard = createCard(createLeagueCardData);
            cardContainer.appendChild(createLeagueCard);
        } else {
            userLeagues[0].forEach(league => {
                league.buttonText = 'View League'; // Add a button text to each league card
                league.url = `/home?username=${username}`;
                const leagueCard = createCard(league);
                cardContainer.appendChild(leagueCard);
            });

            // Allow creating a new league only if the user has less than 3 leagues
            if (userLeagues[0].length < 3) {
                const createLeagueCardData = {
                    title: 'Create New League',
                    description: 'You can create a new league.',
                    buttonText: 'Create League'
                };
                const createLeagueCard = createCard(createLeagueCardData);
                cardContainer.appendChild(createLeagueCard);
            }
        }
    } catch (error) {
        console.error('Error fetching leagues:', error);
        alert('There was an error fetching leagues.');
    }
});

function createCard(cardData) {
    const card = document.createElement('div');
    card.className = 'card';

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

    const button = document.createElement('button');
    button.textContent = cardData.buttonText;
    button.addEventListener('click', function() {
        if (cardData.url) {
            getPortfolio(cardData);
        } else {
            showCreateLeagueForm(card);
        }
    });
    card.appendChild(button);

    return card;
}


function getPortfolio(cardData) {
    if (cardData.url) {
        const url = new URL(cardData.url, window.location.origin);
        url.searchParams.append('portfolio_name', cardData.portfolio_name);
        window.location.href = url.toString();
    }
}

function showCreateLeagueForm(card) {
    // Remove existing form if present
    const existingForm = card.querySelector('.create-league-form');
    if (existingForm) {
        card.removeChild(existingForm);
    }

    // Create input and submit button
    const form = document.createElement('div');
    form.className = 'create-league-form';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter league name';
    form.appendChild(input);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', function() {
        createLeague(input.value);
    });
    form.appendChild(submitButton);

    card.appendChild(form);
}

async function createLeague(leagueName) {
    if (leagueName.trim()) {
        console.log('Creating league:', leagueName);
        const queryParams = new URLSearchParams(window.location.search);
        const username = queryParams.get('username');
        console.log('Username:', username);

        if (!username) {
            alert('Username is not provided in the URL.');
            return;
        }

        try {
            // Fetch the current leagues again to ensure up-to-date information
            const getLeagueResponse = await fetch(`/getLeague?username=${username}`);
            const userLeagues = await getLeagueResponse.json();

            // Check if the user already has 3 leagues
            if (userLeagues[0].length >= 3) {
                alert('You have reached the maximum number of leagues.');
                return;
            }

            // Handle league creation logic here, e.g., send data to server
            const createLeagueResponse = await fetch('/createLeague', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ leagueName, username })
            });

            const createLeagueData = await createLeagueResponse.json();
            console.log('League created:', createLeagueData);
            alert('League created: ' + leagueName);

            // Fetch the created league information
            const updatedLeagueResponse = await fetch(`/getLeague?username=${username}`);
            const updatedLeagueData = await updatedLeagueResponse.json();
            console.log('Updated league data:', updatedLeagueData);
            // Handle updated league data

        } catch (error) {
            console.error('Error:', error);
            alert('There was an error creating the league.');
        }
    } else {
        alert('Please enter a league name.');
    }
}
