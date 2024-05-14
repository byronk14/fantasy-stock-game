const button = document.getElementById('api-button');

button.addEventListener('click', () => {
  fetch('/users/userProfile', {
    method: 'post'
  })
    .then(response => response.text())
    .then(message => console.log(message));
});