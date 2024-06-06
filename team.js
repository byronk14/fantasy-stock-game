document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.getElementById('card-container');
  
    const cardsData = [
      {
        title: 'Title 1',
        description: 'Description of item 1'
      },
      {
        title: 'Title 2',
        description: 'Description of item 2'
      }
      // Add more card data as needed
    ];
  
    function createCard(cardData) {
      const card = document.createElement('div');
      card.className = 'card';

  
      const title = document.createElement('h3');
      title.textContent = cardData.title;
  
      const description = document.createElement('p');
      description.textContent = cardData.description;
  
      const button = document.createElement('button');
      button.textContent = 'Read More';
  
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(button);
  
      return card;
    }
  
    cardsData.forEach(cardData => {
      const card = createCard(cardData);
      cardContainer.appendChild(card);
    });
  });
  