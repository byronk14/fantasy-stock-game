document.addEventListener('DOMContentLoaded', async () => {
  const username = new URLSearchParams(window.location.search).get('username');
  const portfolio_name = new URLSearchParams(window.location.search).get('portfolio_name');

      try {
        // Fetch the stock pool
        const stockResponse = await fetch('/getStockPool');
        if (!stockResponse.ok) throw new Error('Failed to fetch stock pool');
        const stockData = await stockResponse.json();

        // Fetch the portfolio data
        const portfolioResponse = await fetch(`/getCurrentPortfolio?username=${username}&portfolio_name=${portfolio_name}`);
        if (!portfolioResponse.ok) throw new Error('Failed to fetch portfolio');
        const portfolioData = await portfolioResponse.json();
        console.log('portfolioData', portfolioData)
        const portfolioStocks = portfolioData.flat().map(stock => stock.stock_symbol); // Extract symbols
        console.log('Portfolio Stocks:', portfolioStocks);

        const tableBody = document.querySelector('#stock-table tbody');
        const fragment = document.createDocumentFragment(); // Use a document fragment for better performance

        stockData.forEach(innerArray => {
          innerArray.forEach(stock => {
            const row = document.createElement('tr');
            const isStockInPortfolio = portfolioStocks.includes(stock.symbol);

            row.innerHTML = `
              <td class="action-cell">
                <button class="action-button" onclick="handleButtonClick(this)" ${isStockInPortfolio ? 'disabled' : ''}>
                  ${isStockInPortfolio ? 'Added' : 'Add'}
                </button>
              </td>
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
            fragment.appendChild(row);
          });
        });

        tableBody.appendChild(fragment); // Append all rows at once
      } catch (error) {
        console.error('Error:', error);
      }
});

function handleButtonClick(button) {
  const username = new URLSearchParams(window.location.search).get('username');
  const portfolio_name = new URLSearchParams(window.location.search).get('portfolio_name');

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
        username: username,
        portfolio_name: portfolio_name
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
      if (data.success){
        button.disabled = true;
        button.innerText = 'Added';
        console.log('Success:', data);
    }
    else {
        console.error('Error:', error);
    };
  })
}