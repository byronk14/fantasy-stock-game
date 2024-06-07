document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.getElementById('card-container');
  
    // Example data
    const userLeagues = [
      // {
      //   imgSrc: 'image1.jpg',
      //   title: 'League 1',
      //   description: 'Description of league 1',
      //   url: 'https://example.com/league1'
      // },
      // {
      //   imgSrc: 'image2.jpg',
      //   title: 'League 2',
      //   description: 'Description of league 2',
      //   url: 'https://example.com/league2'
      // }
    ];
  
    function createCard(cardData) {
      const card = document.createElement('div');
      card.className = 'card';
  
      if (cardData.imgSrc) {
        const img = document.createElement('img');
        img.src = cardData.imgSrc;
        img.alt = cardData.title;
        card.appendChild(img);
      }
  
      const title = document.createElement('h3');
      title.textContent = cardData.title;
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
        window.location.href = cardData.url;
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
  
    function createLeague(leagueName) {
      if (leagueName.trim()) {
        console.log('Creating league:', leagueName);
        console.log(window.location.search);
        const username = new URLSearchParams(window.location.search).get('username');
        console.log(username);
        // Handle league creation logic here, e.g., send data to server
        const createLeagueResponse = fetch('/createLeague', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ leagueName, username })
        })
        .then(response => response.json())

        alert('League created: ' + leagueName);
      } else {
        alert('Please enter a league name.');
      }
    }
  
    if (userLeagues.length === 0) {
      const createLeagueCardData = {
        title: 'No Leagues Found',
        description: 'You are not in any league.',
        buttonText: 'Create League'
      };
      const createLeagueCard = createCard(createLeagueCardData);
      cardContainer.appendChild(createLeagueCard);
    } else {
      userLeagues.forEach(league => {
        league.buttonText = 'View League'; // Add a button text to each league card
        const leagueCard = createCard(league);
        cardContainer.appendChild(leagueCard);
      });
    }
  });
  