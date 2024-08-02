import { cerrarSesion, checkSession, User, Manager, eyesIcon } from "./functions.js";
cerrarSesion();
checkSession();
eyesIcon();

const manager = new Manager();
const obj = JSON.parse(localStorage.getItem('object'));
const user = new User(
  obj.name,
  obj.email,
  obj.country,
  obj.city,
  obj.user,
  obj.pass
);
let userPass = user.pass;

document.addEventListener("DOMContentLoaded", () => {
	const userName = document.getElementById("user");
	const userEmail = document.getElementById("email");
	const userCountry = document.getElementById("country");
	const userCity = document.getElementById("city");			
		
	userName.innerText = `${user.user}`;
	userEmail.innerText = `${user.email}`;
	userCountry.innerText = `${user.country}`;
	userCity.innerText = `${user.city}`;
	
	const editIcons = document.querySelectorAll('img[alt="Editar"]');
	editIcons.forEach(
		icon =>
			icon.addEventListener('click', () => {
				editar(icon.getAttribute('name'));
			})
	);

	const tickIcons = document.querySelectorAll('img[alt="Guardar"]');
	tickIcons.forEach(
		icon =>
			icon.addEventListener('click', () => {
				guardar(icon.getAttribute('name'));
			})
	);

	const cancelIcons = document.querySelectorAll('img[alt="Undo"]');
	cancelIcons.forEach(
        icon =>
            icon.addEventListener('click', () => {
				cancelar(icon.getAttribute('name'));
			})
	);

	//ventana y boton de password
	const passBtn = document.querySelector('#editIcon_pass');
	passBtn.addEventListener('click', () => {
		editar('pass');
	});

	const accBtn = document.querySelector('#editIcon_acc');
	accBtn.addEventListener('click', () => {
		editar('acc');
	});

	const inputPass = document.querySelector("input#confirmPass");
	const divIcon = document.querySelector("div.iconImg");
	inputPass.addEventListener('input', () => {
		if (inputPass.value !== "") {
			divIcon.style.display = 'inline'
		} else {
			divIcon.style.display = "none";
		}
	});

	const closeIcon = document.querySelector('.close');
	closeIcon.addEventListener('click', () => {
		closeEmergente();
	});
});


function editar(option) {
	
	if ( option !== 'acc') {
		const edit = document.getElementById("editIcon_" + option);	
		const check = document.getElementById("checkIcon_" + option);
		const cancel = document.getElementById("cancelIcon_" + option);
		edit.style.display = "none";
		check.style.display = "inline";	
		cancel.style.display = "inline";
	}

	const p = document.getElementById(option);

	if (option === "pass" || option === "acc") {
		localStorage.setItem("optionClicked", option);
		return openEmergente();
	}
	if (option === "country") {
		return opcionesSelect();
	}	

	const input = document.createElement("input");
	const oldValue = p.textContent;
	input.type = "text";	
	input.setAttribute('id', option);
	input.value = oldValue;
	localStorage.setItem("oldValue", oldValue)
	p.replaceWith(input);
	input.focus();
}

function guardar(option) {

	const check = document.getElementById("checkIcon_" + option);
	const edit = document.getElementById("editIcon_" + option);
	const cancel = document.getElementById("cancelIcon_" + option);
	check.style.display = "none";
	edit.style.display = "inline";
	cancel.style.display = "none";

	const p = document.createElement("p");
	p.classList.add('newElement');
	p.setAttribute('id', option);

	if (option === "country") {
		const select = document.querySelector("select");
		const newValue = select.value;
		p.textContent = newValue;
		select.replaceWith(p);
		let data = { [option]: newValue };
		manager.actualizar( data );
		return;
	}

	const input = document.querySelector(`#${option}`);
	const newValue = input.value;

	if (newValue === "") {
		p.textContent = localStorage.getItem("oldValue");	
		input.replaceWith(p);
		mostrarError(p.getAttribute('class'));
		return;
	}

	p.textContent = (option === 'pass') ? "" : newValue;	
	input.replaceWith(p);	
	let data = { [option]: newValue }
	manager.actualizar( data );
}

function cancelar(option) {
	
	const edit = document.getElementById("editIcon_" + option);	
	const check = document.getElementById("checkIcon_" + option);
	const cancel = document.getElementById("cancelIcon_" + option);
	edit.style.display = "inline";
	check.style.display = "none";	
	cancel.style.display = "none";

	const input = document.getElementById(option);
	const p = document.createElement("p");
	p.setAttribute('id', option);		
	p.innerText = localStorage.getItem("oldValue");	
	input.replaceWith(p);
	return;
}

function openEmergente() {
	const emergente = document.getElementById("confirmWindow");
	const inputEmergente = document.getElementById("confirmPass");
	document.body.classList.add("emergente-open");
	inputEmergente.focus();
	emergente.style.display = "flex";
}

function closeEmergente() {
	const emergente = document.getElementById("confirmWindow");
	iconsPassword();
	document.getElementById("confirmPass").value = "";
	document.body.classList.remove("emergente-open");
	emergente.style.display = "none";
}

const btnPass = document.getElementById("confirmButton");
btnPass.addEventListener("click", async function () {

	const option = localStorage.getItem("optionClicked");
	const passValido = iconsPassword();

	if (option === "acc" && passValido === true) {

		const obj = JSON.parse(localStorage.getItem("object"));
		const userName = obj.user;
		await manager.eliminar(userName);		
		localStorage.clear();
		window.location.href = "/index";
	}

	if (!passValido) {

		localStorage.removeItem("optionClicked");
		const emergente = document.getElementById("confirmWindow");
		document.getElementById("confirmPass").value = "";
		document.body.classList.remove("emergente-open");
		emergente.style.display = "none";
		passIncorrecto();
	}

	if (option === "pass" && passValido) {

		localStorage.removeItem("optionClicked");
		const input = document.createElement("input");
		input.type = "text";
		input.value = userPass;
		input.setAttribute('id', "pass");
		document.getElementById("pass").replaceWith(input);
		closeEmergente();
		input.focus();
	}
});

function iconsPassword() {
	let pass = document.getElementById("confirmPass").value;
	const option = localStorage.getItem("optionClicked");
	const editAcc = document.getElementById("editIcon_acc");
	const checkPass = document.getElementById("checkIcon_pass");
	const editPass = document.getElementById("editIcon_pass");
	const cancelPass = document.getElementById("cancelIcon_pass");

	if (option === "acc" & pass === userPass) {
		editAcc.style.display = "block";
		return true;
	}
	
	if (pass !== userPass || pass === "") {

		checkPass.style.display = "none";
		cancelPass.style.display = "none";
		editPass.style.display = "inline";
		return false;

	} else {

		checkPass.style.display = "inline";
		cancelPass.style.display = "inline";
		editPass.style.display = "none";
		editAcc.style.display = "block";
		return true;

	}
}

const passIncorrecto = () => {
	const divContenedor = document.getElementById("displayError");
	const divError = document.createElement("div");
	divError.classList.add("loginError");
	divError.innerHTML = `<p><span>&#10006;</span> La contraseña ingresada no es correcta</p>`;
	divContenedor.appendChild(divError);
  
	setTimeout(() => {
	  divError.remove();
	}, 2000);
};

function opcionesSelect() {
	const p = document.getElementById("country");
	const select = document.createElement("select");
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
	document.getElementById("checkIcon_country").style.display = "inline";
	p.replaceWith(select);
}

function mostrarError(element) {	
	const container = document.querySelector(`.${element}`);
	const divError = document.createElement("div");
	divError.classList.add('configError');	
	divError.innerHTML = `<p><span>&#10006;</span> El campo no puede estar vacío</p>`;	
	container.appendChild(divError);

	setTimeout(() => {
	  divError.remove();
	}, 2000);
  };
