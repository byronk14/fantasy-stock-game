const button = document.getElementById('api-button');

button.addEventListener('click', loginEvent);

// Functions
async function loginEvent() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('message');

  try {
      // Attempt to create a new user
      const createUserResponse = await fetch('/userProfile', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
      });

      const createUserData = await createUserResponse.json();

      if (createUserResponse.status === 409) {
          // User already exists, attempt to log in
          const loginResponse = await fetch('/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ username, password })
          });

          const loginData = await loginResponse.json();

          if (loginResponse.status === 200) {
              // Successful login, redirect to home page
              if (loginData.redirected) {
                  const url = new URL(loginData.url, window.location.origin);
                  url.searchParams.set('username', username);
                  window.location.href = url.toString();
              }
          } else {
              // Incorrect password
              messageDiv.textContent = loginData.message;
          }
      } else if (createUserResponse.status === 200) {
          // Successful account creation, redirect to home page
          if (createUserData.redirected) {
            const url = new URL(loginData.url, window.location.origin);
              url.searchParams.set('username', username);
              window.location.href = url.toString();
          }
      } else {
          // Handle other errors
          messageDiv.textContent = createUserData.message;
      }
  } catch (error) {
      console.error('Error:', error);
      messageDiv.textContent = 'An unexpected error occurred.';
  }
}