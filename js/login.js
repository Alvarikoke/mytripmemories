document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar que se envíe el formulario de manera predeterminada
  
    // Obtener los valores del formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Crear un objeto con los datos a enviar al servidor
    const data = {
      username: username,
      password: password,
    };
  
    // Realizar una solicitud POST al servidor
    fetch('http://localhost:3000/login', {
      method: 'POST',
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
      console.log("Error en la solicitud:", error);
    });
  });