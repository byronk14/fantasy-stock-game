const get_team_button = document.getElementById('get-team-button');

get_team_button.addEventListener('click', getTeam);

function getTeam() {
    const username = new URLSearchParams(window.location.search).get('username');
  
    fetch(`/getTeam?username=${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById('lineup-body');
        const portfolioName = document.querySelectorAll('.portfolio-name');

        portfolioName.forEach(portfolioName => {
            portfolioName.textContent = data[1][0][0].portfolio_name;
        })

        tableBody.innerHTML = '';

        data[0][0].forEach(player => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>Stock</td>
                <td>${player.stock_symbol}</td>
                <td>${player.stock_name}</td>
            `;
            tableBody.appendChild(row);
      })
    })
      .catch(error => {
        console.error('Error:', error);
  })
};