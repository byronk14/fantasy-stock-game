document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/getStockPool');
    const stockData = await response.json();
    const tableBody = document.querySelector('#stock-table tbody');

    stockData.forEach(innerArray => {

        innerArray.forEach(stock => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td class= "action-cell"><button class="action-button" onclick="handleButtonClick(this)">Add</button></td>
              <td>${stock.symbol}</td>
              <td>${stock.stock_close}</td>
              <td>${stock.stock_high}</td>
              <td>${stock.stock_low}</td>
              <td>${stock.stock_open}</td>
              <td>${stock.stock_trade_count}</td>
              <td>${stock.stock_volume}</td>
              <td>${stock.stock_vwap}</td>
              <td>${new Date(stock.stock_timestamp).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    });
  });

function handleButtonClick(button) {
  const username = new URLSearchParams(window.location.search).get('username');
    // Get the row containing the clicked button
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');


    const stock = {
        stock_symbol: cells[1].innerText,
        stock_close: cells[2].innerText,
        stock_high: cells[3].innerText,
        stock_low: cells[4].innerText,
        stock_open: cells[5].innerText,
        stock_trade_count: cells[6].innerText,
        stock_volume: cells[7].innerText,
        stock_vwap: cells[8].innerText,
        stock_timestamp: cells[9].innerText,
        username: username
    };

    fetch('/addStock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stock)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Optionally, provide feedback to the user here
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}