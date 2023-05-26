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
          let viajeEncoded = encodeURI(viajeName.toString());
          clone.querySelector('.linkViaje').textContent = viajeName;
          clone.querySelector('.linkViaje').setAttribute('href', "mapa.html?trip=" + viajeEncoded);
          console.log(viajeEncoded)
          fragment.appendChild(clone);
        });

        viajesContainer.appendChild(fragment);
      })
      .catch(error => console.log(error));
});