const button = document.getElementById('api-button');

button.addEventListener('click', addUser);

// Functions
function addUser() {
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
  .then(response => response.json().then(data => ({status: response.status, body: data}))) // Get both status and body
  .then(({status, body}) => {
      const messageDiv = document.getElementById('message');
      if (status === 409) {
          // Account already exists
          messageDiv.textContent = body.message;
      } else if (status === 200) {
          // Redirect on successful creation
          if (body.redirected) {
              const url = new URL(body.url);
              url.searchParams.set('username', username);
              window.location.href = url.toString();
          }
      } else {
          // Handle other errors
          messageDiv.textContent = body.message;
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}



