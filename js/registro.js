'use strict'

// Extraer la URL
let currentUrl = window.location.href;

// Sacar los digitos del ChatID de la URL
const chat_id = currentUrl.substring(currentUrl.lastIndexOf('=') + 1);

document.getElementById('registrationForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Evitar que se envíe el formulario de manera predeterminada

  // Obtener los valores del formulario
  const username = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password2').value;

  // Verificar si las contraseñas coinciden
  if (password !== password2) {
    console.log("Las contraseñas no coinciden");
    return; // Detener la ejecución si las contraseñas no coinciden
  }

  // Crear un objeto con los datos a enviar al servidor
  const data = {
    username: username,
    password: password,
    chat_id: chat_id
  };

  // Realizar una solicitud POST al servidor
  fetch('http://localhost:3000/registro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      console.log("Registro exitoso");
      window.location.href = "login.html";
    } else {
      console.log("Error en el registro");
      // Aquí se puede mostrar un mensaje de error al usuario
    }
  })
  .catch(error => {
    console.log("Error en la solicitud:", error);
  });
});
