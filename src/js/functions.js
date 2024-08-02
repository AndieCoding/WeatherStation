function checkSession() {
    const obj = localStorage.getItem('object');    
    if (!obj) window.location.href = "/index"
}

function cerrarSesion() {
  const btnSalir = document.getElementById("logOff");
  btnSalir.addEventListener("click", () => {
    localStorage.removeItem("object");
    window.location.href = "/index";
  });
  }

function eyesIcon() {
  const inputPassword = document.getElementById("confirmPass");  
  const imgOpenEye = document.querySelector("#img-open-eye");
  inputPassword.addEventListener('input', () => {
    if (inputPassword.value !== "") {
      imgOpenEye.style.display = "inline";
    } else {
      imgOpenEye.style.display = "none";
    }
  });

  const eyes = document.querySelectorAll('img.eye-icon');
	eyes.forEach( 
		eye => 
			eye.addEventListener('click', () => {
				closeOrOpen();
			})
	)
}
function closeOrOpen() {  
  const inputPassword = document.getElementById("confirmPass");
  const imgCloseEye = document.getElementById("img-close-eye");
  const imgOpenEye = document.getElementById("img-open-eye");
  
	inputPassword.type = inputPassword.type === "text" ? "password" : "text";  
  
	if (inputPassword.type === "text") {

		imgOpenEye.style.display = "none";
		imgCloseEye.style.display = "inline";

	} else {

		imgCloseEye.style.display = "none";
		imgOpenEye.style.display = "inline";

	}   
}

function select() {
    const select = document.getElementById("select");
    const paises = [
      "Argentina",
      "Bolivia",
      "Brasil",
      "Chile",
      "Colombia",
      "Ecuador",
      "Guyana",
      "Paraguay",
      "Perú",
      "Surinam",
      "Uruguay",
      "Venezuela",
    ];
    const opciones = paises.map((x) => {
      return `<option value="${x}">${x}</option>`;
    });
    select.innerHTML = opciones.join("");
  }

let map;
function insertarMapa(lat, lon) {
  map = L.map("map").setView([lat, lon], 12);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map); 
  const circle = L.circle([lat, lon], {
    color: "light-blue",
    fillColor: "#6C98C1",
    fillOpacity: 0.2,
    radius: 6000,
  }).addTo(map);
}
function changeMap(lat, lon) {
  map.setView(new L.LatLng(lat, lon), 12);
  const circle = L.circle([lat, lon], {
    color: "light-blue",
    fillColor: "#6C98C1",
    fillOpacity: 0.2,
    radius: 6000,
  }).addTo(map);
}

class User {
  constructor(name, email, country, city, user, pass) {
    this.name = name;
    this.email = email;
    this.country = country;
    this.city = city;
    this.user = user;
    this.pass = pass;
  }
}

class Manager {
  constructor() {    
  }
  async actualizar(data) {
    const obj = JSON.parse(localStorage.getItem('object'));
    const userLogged = obj.user;
  
    fetch(`http://localhost:3000/api/update/${userLogged}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(
      (response) => response.json()
    ).then(
      (data) => {        
          
        const obj = {
          user: data.userData.user,
          name: data.userData.name,
          email: data.userData.email,
          country: data.userData.country,
          city: data.userData.city,
          pass: data.userData.pass,            
        }          
        localStorage.setItem('object', JSON.stringify(obj))
        
      })
    .catch((error) => console.error("Error:", error));
  }

  async registro(data) {
    try {
      const response = await fetch("http://localhost:3000/api/registro", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
    
      const result = await response.json(); 
      console.log(result);
      return result;
      
    }catch(error) {
      console.error("Error:", error);
    }; 
  }

  async ingresar() {    
    const user = document.getElementById("user").value;
    const pass = document.getElementById("confirmPass").value;
  
    const login = {
      user,
      pass
    };
    try {

      const response = await fetch("http://localhost:3000/api/user", {  
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(login),    
      });

      const result = await response.json();

      if (result) {return result}
      return false;

    } catch (err) {
      console.error("Error during login:", err);
      throw err;
    }
  }

  async eliminar(user) { 
    const response = await fetch(`http://localhost:3000/api/deleteAccount?user=${user}`, {
      method: "DELETE",
    });
    const data = await response.json();
  
    return data;
   }
}

class EstacionClimatica {
  constructor() {    
  }
  async obtenerClima(pais, localidad) {
    const key = `9963094be793228ca9bf57b5a25bba28`;    

    try {

      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${localidad},${pais}&appid=${key}`);
      const result = await response.json();      
      const {main: { humidity, temp }} = result;   
      
      let tempActual = (temp - 273.15).toFixed(1);
      let humedad = humidity;     
      return {tempActual, humedad};
    
    } catch (err) {

      console.error("Error during fetch:", err);    
      throw err;

    }
  }
}


 
export { 
  eyesIcon,
  closeOrOpen,
  select, 
  checkSession, 
  insertarMapa, 
  changeMap, 
  cerrarSesion,
  User,
  Manager,
  EstacionClimatica
};


