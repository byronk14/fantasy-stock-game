const button = document.getElementById('api-button');

button.addEventListener('click', addUser);

// Functions
function addUser () {
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
        const url = new URL(response.url);
        url.searchParams.set('username', username);
        window.location.href = url.toString();
      }
    })
    .catch(error => console.error('Error:', error));
};


