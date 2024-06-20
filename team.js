document.addEventListener('DOMContentLoaded', async function() {  
    const cardContainer = document.getElementById('card-container');
    const username = new URLSearchParams(window.location.search).get('username');

    try {
        const getLeagueResponse = await fetch(`/getLeague?username=${username}`, {
            cache: "no-cache"
        });

        if (!getLeagueResponse.ok) {
            throw new Error(`Failed to fetch leagues. Status: ${getLeagueResponse.status}`);
        }

        const userLeagues = await getLeagueResponse.json();
        console.log(userLeagues);

        // Ensure userLeagues exists before checking length
        if (!userLeagues.length || (userLeagues.length === 1 && userLeagues[0].length === 0)) {
            const createLeagueCardData = {
                title: 'No Leagues Found',
                description: 'You are not in any league.',
                buttonText: 'Create League'
            };
            const createLeagueCard = createCard(createLeagueCardData, cardContainer, username);
            cardContainer.appendChild(createLeagueCard);
        } else {
            userLeagues[0].forEach(league => {
                league.buttonText = 'View League'; // Add a button text to each league card
                league.url = `/home?username=${username}`;
                const leagueCard = createCard(league, cardContainer, username);
                cardContainer.appendChild(leagueCard);
            });

            // Allow creating a new league only if the user has less than 3 leagues
            if (userLeagues[0].length < 3) {
                const createLeagueCardData = {
                    title: 'Create New League',
                    description: 'You can create a new league.',
                    buttonText: 'Create League'
                };
                const createLeagueCard = createCard(createLeagueCardData, cardContainer, username);
                cardContainer.appendChild(createLeagueCard);
            }
        }
    } catch (error) {
        console.error('Error fetching leagues:', error);
        alert('There was an error fetching leagues.');
    }
});

function createCard(cardData, cardContainer, username) {
    const card = document.createElement('div');
    card.classList.add('card');

    // Add the delete icon only if the card is not for creating a new league
    if (cardData.description !== 'You can create a new league.' && cardData.description !== 'You are not in any league.') {
        const deleteIcon = document.createElement('span');
        deleteIcon.textContent = '❌';  // Unicode for a cross mark
        deleteIcon.classList.add('delete-icon');
        deleteIcon.addEventListener('click', () => {
            cardContainer.removeChild(card);
            // Optionally: Add logic to handle server-side deletion here
            fetch(`/deleteLeague?portfolio_id=${cardData.portfolio_id}`, { method: 'DELETE' });
        });
        card.appendChild(deleteIcon);
    }

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
        if (cardData.description === 'You can create a new league.' || cardData.description === 'You are not in any league.') {
            // Hide the "Create League" button
            button.style.display = 'none';

            // Create and show the input field and "Submit" button
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.placeholder = 'Enter league name';
            card.appendChild(inputField);

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.addEventListener('click', function() {
                // Handle the submit action (e.g., send data to the server)
                const leagueName = inputField.value;
                createLeague(leagueName, username);
            });
            card.appendChild(submitButton);
        } else if (cardData.url) {
            getPortfolio(cardData);
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

async function createLeague(leagueName, username) {
    if (leagueName.trim()) {
        console.log('Creating league:', leagueName);

        if (!username) {
            alert('Username is not provided in the URL.');
            return;
        }

        try {
            // Fetch the current leagues again to ensure up-to-date information
            const getLeagueResponse = await fetch(`/getLeague?username=${username}`);
            const userLeagues = await getLeagueResponse.json();
            console.log('userLeague', userLeagues)
            // Check if the user already has 3 leagues
            if (userLeagues.length && userLeagues[0].length >= 3) {
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
