'use strict'

document.getElementById('logout').addEventListener("click", function () {
  fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        console.log("Logout exitoso");
        window.location.href = "index.html";
      } else {
        console.log("Error en el logout");
        // Aquí se puede mostrar un mensaje de error al usuario
      }
    })
    .catch(error => {
      console.log("Error: ", error);
    });
});
