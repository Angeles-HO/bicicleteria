import { User } from "../js/classes/user.js"
import { Storage } from "../js/classes/storage.js"

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.registration-form');

    formulario.addEventListener('submit', function(e) {
        e.preventDefault()
        const username = document.getElementById('username').value.trim();
        const firstname = document.getElementById('firstname').value.trim();
        const lastname = document.getElementById('lastname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email) {
            alert("Ingrese un email valido");
            return;
        }

        // Ahora algo siemple, despues validaciones como: [1-Mayuscula, 1-caracter especial]
        if (password.length < 8) {
            alert("La contraseña tiene que tener como minimo 8 caracteres");
            return;
        }

        const newUser = new User(username, firstname, lastname, email, password);

        Storage.set("regDATAform", newUser);
        
        window.location.href = "../login/login.html";
    });
});