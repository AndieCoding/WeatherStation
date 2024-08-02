import * as functions from "./functions.js";
functions.select();
functions.eyesIcon();

const formRegistro = document.getElementById("registro");
formRegistro.addEventListener("submit", async (event) => {

  event.preventDefault();

  const user = new functions.User(
    document.getElementById("name").value,
    document.getElementById("correo").value,
    document.getElementById("select").value,
    document.getElementById("localidad").value,
    document.getElementById("user").value,
    document.getElementById("confirmPass").value,
  );

  const manager = new functions.Manager();
  const data = await manager.registro(user);

  if (data.success) {
    localStorage.setItem('object', JSON.stringify(user));
    window.location.href = "/clima";
  } else {
    mostrarError(data.message);
  }
})

const mostrarError = (error) => {
  const divContenedor = document.getElementById("displayError");
  const divError = document.createElement("div");
  divError.classList.add("loginError");
  divError.innerHTML = `<p><span>&#10006;</span> ${error}</p>`;
  divContenedor.appendChild(divError);

  setTimeout(() => {
    divError.remove();
  }, 3000);
};