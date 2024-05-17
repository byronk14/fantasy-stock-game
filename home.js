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
        const tableContainer = document.getElementById('table-container');
        const existingTable = tableContainer.querySelector('table');

        const portfolioTitle = document.getElementById('portfolio-name');
        portfolioTitle.textContent = data[1][0][0].portfolio_name;

        if (!existingTable) {
            const table = document.createElement('table');
            table.setAttribute('style', 'border: 1px solid black; border-collapse: collapse;');

            data[0][0].forEach(row => {
                const tableRow = document.createElement('tr');
                Object.values(row).forEach(cell => {
                const tableCell = document.createElement('td');
                tableCell.textContent = cell;
                tableCell.setAttribute('style', 'border: 1px solid black; padding: 5px;');
                tableRow.appendChild(tableCell);
                });
                table.appendChild(tableRow);
            });

            tableContainer.appendChild(table);
        }
      })
      .catch(error => console.error('Error:', error));
  };