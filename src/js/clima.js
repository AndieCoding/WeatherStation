import * as functions from "./functions.js";
functions.checkSession();
functions.cerrarSesion();

const station = new functions.EstacionClimatica();
const obj = JSON.parse(localStorage.getItem('object'));
const user = new functions.User(
  obj.name,
  obj.email,
  obj.country,
  obj.city,
  obj.user,
  obj.pass
);

document.addEventListener("DOMContentLoaded", async () => {
  const userName = document.getElementById("userName");
  const spanTemp = document.getElementById("spanTemp");
  const spanLocalidad = document.getElementById("spanLocalidad");    
  const userLogged = user.user;
  const encodedCity = encodeURIComponent(user.city);

  spanLocalidad.innerText = `${user.city}`;
  userName.innerText = `${userLogged}`;  
  functions.select();
  
  const formClima = document.getElementById("formClima");
  formClima.addEventListener("submit", (event) => {
    event.preventDefault();
    obtenerClima();
  });

  try {

    const data = await station.obtenerClima(user.country, encodedCity);  
    const tempActual = data.tempActual;
    spanTemp.innerText = `${tempActual}`;

    const response = await fetch(`https://geocode.maps.co/search?q=${encodedCity}&api_key=65b2703b12bdc409410812jxbd55c41`);
    const result = await response.json();
    if (result) {
      const coord = {
        lat: parseFloat(result[0].lat),
        lon: parseFloat(result[0].lon),
      };
      functions.insertarMapa(coord.lat, coord.lon);
    }

  } catch (err) {

    console.error(err);    

  }
});

async function obtenerClima(e) {
  const localidad = document.getElementById("localidad").value;
  const pais = document.getElementById("select").value;

  if (localidad.trim() == "") {
    mostrarError("No se encuentra la localidad");
    return;
  }  
  changeMap();
  const data = await station.obtenerClima(pais, localidad);
  
  if (data.cod == 404) {

    return mostrarError("No se encuentra la localidad");

  } else {
  
    mostrarResultado(data.humedad, data.tempActual);

  }
}

const divResultados = document.getElementById("resultados");

function mostrarResultado(humedad, temperatura) {
  const localidad = document.getElementById("localidad").value;
  const divExistente = document.getElementById("divCondiciones");

  if (localidad === "") return;

  if (divExistente) {
    divCondiciones.innerHTML = `<p class="tituloResult">${localidad}</p><p>La temperatura es <span class='spanTemperatura'>${temperatura}º</span></p><p>La humedad es <span class='spanTemperatura'>${humedad}%</span></p>`;
  } else {
    const divCondiciones = document.createElement("div");
    divCondiciones.classList.add("tempLocal");
    divCondiciones.setAttribute("id", "divCondiciones");
    divCondiciones.innerHTML = `<p class="tituloResult">${localidad}</p><p>La temperatura es <span class='spanTemperatura'>${temperatura}º</span></p><p>La humedad es <span class='spanTemperatura'>${humedad}%</span></p>`;
    divResultados.appendChild(divCondiciones);
  }
  addToHistory(localidad, temperatura, humedad);
}

function mostrarError(mensaje) {
  const divExistente = document.getElementById("divCondiciones");
  if (divExistente) {
    divExistente.remove();
  }
  const divError = document.createElement("div");
  divError.classList.add("divError");
  divError.innerHTML = `<p id="mensajeError">${mensaje}</p>`;
  divResultados.appendChild(divError);

  setTimeout(() => {
    divError.remove();
  }, 2500);
}

function changeMap() {
  const encodedCity = encodeURIComponent(
    document.getElementById("localidad").value
  );
  fetch(
    `https://geocode.maps.co/search?q=${encodedCity}&api_key=65b2703b12bdc409410812jxbd55c41`
  )
    .then((response) => response.json())
    .then((data) => {
      const coord = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
      functions.changeMap(coord.lat, coord.lon);
    });
}

function addToHistory(local, temp, hum) {
  const newHistory = document.createElement("div");
  const divHistory = document.getElementById("history");
  let gridOrder = 1;
  const maxCards = 3;
  newHistory.classList.add("cardHistory");
  newHistory.innerHTML = `<div class="cardHistory"><p class="tituloResult">${local}</p><p>La temperatura es <span class='spanTemperatura'>${temp}º</span></p><p>La humedad es <span class='spanTemperatura'>${hum}%</span></p></div>`;

  if (divHistory.childElementCount >= maxCards) {
    divHistory.removeChild(divHistory.firstElementChild);
  }
  
  if (divHistory.childNodes.length < 1) {
    newHistory.style.order = gridOrder;
  } else {
  Array.from(divHistory.childNodes)
    .filter((node) => node.nodeType === Node.ELEMENT_NODE) // Filter only element nodes
    .forEach((item) => {
      item.style.order = ++gridOrder;
    });
  }
  divHistory.appendChild(newHistory);
}
