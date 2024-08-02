import { eyesIcon, Manager } from "./functions.js"; 


const manager = new Manager();
const formLogin = document.getElementById("login");

document.addEventListener('DOMContentLoaded', () => {

  eyesIcon();  

  formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    try {

      const data = await manager.ingresar();
      
      if (data.message) {    

        mostrarError();  
       

      } else {

        console.log(data);
        localStorage.setItem("object", JSON.stringify(data));        
        window.location.href = "/clima";

      }
    } catch (err) {

      console.error("Error:", err);      
      event.target.reset();

    }
  });
})

const mostrarError = () => {
  const divContenedor = document.getElementById("displayError");
  const divError = document.createElement("div");
  divError.classList.add("loginError");
  divError.innerHTML = `<p><span>&#10006;</span> La cuenta ingresada no es correcta</p>`;
  divContenedor.appendChild(divError);

  setTimeout(() => {
    divError.remove();
  }, 2000);
};
