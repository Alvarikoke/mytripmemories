'use strict'

// Extraer la URL
let currentUrl = window.location.href;

// Sacar el nombre del viaje de la URL
const trip_name = currentUrl.substring(currentUrl.lastIndexOf('=') + 1);
console.log("Extracto de la URL: " + trip_name)

const data = {
  trip_name: trip_name,
};

fetch("/mapa", {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(data => {
    console.log(data)
    let map = L.map('map').setView([data[0].latitude, data[0].longitude], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const template = document.querySelector('template');
    const templateContent = template.content;

    data.forEach(item => {
      const image = new Image();
      image.src = item.image_url;
      const marker = L.marker([item.latitude, item.longitude]).addTo(map);
      // marker.bindPopup(`<strong>${item.image_name}</strong><br><img src="${item.image_url}" alt="${item.image_name}">`).openPopup();
      marker.on('click', function () {
        const clone = document.importNode(templateContent, true);
        clone.querySelector('h3').textContent = item.image_name;
        clone.querySelector('img').setAttribute('src', item.image_url)
        L.popup().setContent(clone).setLatLng(marker.getLatLng()).openOn(map);
      });
    });
  })
  .catch(err => {
    alert("Hubo error: " + err + ".")
  });