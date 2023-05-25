document.getElementById('logout').addEventListener("click", function () {
  fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        console.log("Login exitoso");
        window.location.href = "viajes.html";
      } else {
        console.log("Error en el login");
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    })
    .catch(error => {
      console.log("Error: ", error);
    });
});

