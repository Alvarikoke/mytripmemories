'use strict'

document.addEventListener('DOMContentLoaded', function () {
    const plantilla = document.getElementById('viajes-template');
    const contenedor = document.getElementById('lista');

    fetch('/viajes', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {

        data.forEach(viaje => {
          let envolver = document.createElement("li");
          let nuevoViaje = plantilla.content.cloneNode(true);

          let viajeName = viaje.trip_name;
          console.log(viajeName)

          nuevoViaje.querySelector('.linkViaje').textContent = decodeURIComponent(viajeName);
          nuevoViaje.querySelector('.linkViaje').setAttribute('href', "mapa.html?trip=" + viajeName);

          envolver.appendChild(nuevoViaje);       
          contenedor.appendChild(envolver);
        });

        viajesContainer.appendChild(fragment);
      })
      .catch(error => console.log(error));
});