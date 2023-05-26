document.addEventListener('DOMContentLoaded', function () {
    const template = document.getElementById('viajes-template');
    const templateContent = template.content;
    const viajesContainer = document.getElementById('viajes');

    fetch('/viajes', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        const fragment = document.createDocumentFragment();

        data.forEach(viaje => {
          const clone = document.importNode(templateContent, true);
          let viajeName = viaje.trip_name;
          console.log(viajeName)
          clone.querySelector('.linkViaje').textContent = decodeURIComponent(viajeName);
          clone.querySelector('.linkViaje').setAttribute('href', "mapa.html?trip=" + viajeName);
          fragment.appendChild(clone);
        });

        viajesContainer.appendChild(fragment);
      })
      .catch(error => console.log(error));
});