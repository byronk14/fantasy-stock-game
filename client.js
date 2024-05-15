const button = document.getElementById('api-button');

button.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;

  fetch('/userProfile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email
    })
  })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url
      }
    })
    .catch(error => console.error('Error:', error));
});