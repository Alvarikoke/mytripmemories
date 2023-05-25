let map = L.map('map').setView([36.7201600, -4.4203400], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

let plantilla = document.querySelector("template"); 
let contenedor = document.querySelector(".rutas");

fetch("https://raw.githubusercontent.com/FRomero999/ExamenDIW2022/main/rutas_arqueologicas.json?classId=a44f2eea-e51b-4a7a-a11a-eefc73428d1a&assignmentId=b6d46e1e-b651-43e1-b861-1d6ba465dd82&submissionId=c773ff20-ba3d-cf9e-1095-93f6fedc73c5")
  .then(response => response.json())
  .then(data => {
      
    data.forEach( function(el){
        let wrap = document.createElement("div");
        
        let nuevaRuta = plantilla.content.cloneNode(true);
        nuevaRuta.querySelector(".titulo").textContent = el.properties.nombre;
        nuevaRuta.querySelector(".horario").textContent = el.properties.horario;
        nuevaRuta.querySelector(".direccion").textContent = el.properties.direccion;

        let telefono = nuevaRuta.querySelector(".telefono");

        if (el.properties.telefono === "") {
            nuevaRuta.querySelector(".label-tel").remove();
        } else {
            telefono.textContent = el.properties.telefono;
        }

        let x = el.properties.x;
        let y = el.properties.y;

        let marker = L.marker([x, y]).addTo(map);

        let label = '<p>' + el.properties.direccion + '</p>' + '<h4>' + el.properties.nombre + '</h4>';

        marker.bindPopup(label);

        wrap.appendChild(nuevaRuta);
        
        wrap.classList.add("border");
        
        contenedor.appendChild(wrap);  
      });
  })
  .catch( err => {
      alert("Hubo error: " + err +".")
  });

var myModal = document.getElementById('myModal')
var myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus()
})