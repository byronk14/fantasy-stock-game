const edit_portfolio_button = document.getElementById('get-stock-pool');

edit_portfolio_button.addEventListener('click', editPortfolio);

document.addEventListener('DOMContentLoaded', async () => {
  const username = new URLSearchParams(window.location.search).get('username');
  const portfolio_name = new URLSearchParams(window.location.search).get('portfolio_name');

  fetch(`/getHome?username=${username}&portfolio_name=${portfolio_name}`, {
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
            <td>${player.stock_symbol}</td>
            <td>${player.stock_close}</td>
            <td>${player.stock_high}</td>
            <td>${player.stock_low}</td>
            <td>${player.stock_open}</td>
            <td>${player.stock_trade_count}</td>
            <td>${player.stock_volume}</td>
            <td>${player.stock_vwap}</td>
            <td>${new Date(player.stock_timestamp).toLocaleString()}</td>
          `;
          tableBody.appendChild(row);
    })
  })
    .catch(error => {
      console.error('Error:', error);
})

      
  }
)

function editPortfolio() {
  const username = new URLSearchParams(window.location.search).get('username');

  if (username) {
    window.location.href = `/stockPool?username=${username}`;
  }
  else {
    console.error('Username not found in URL parameters');
  }
}