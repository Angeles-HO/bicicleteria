import { Usuario } from "../classes/models/Usuario.js"
import { Storage } from "../classes/services/storage.js"

function thisEIV(correo) {
    // https://w3.unpocodetodo.info/utiles/regex-ejemplos.php?type=email
    // https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
    const verifyRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!verifyRegex.test(correo)) {
        alert("Formato invalido");
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.registration-form');

    formulario.addEventListener('submit', function(e) {
        e.preventDefault()
        const username = document.getElementById('username').value.trim();
        const firstname = document.getElementById('firstname').value.trim();
        const lastname = document.getElementById('lastname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (thisEIV(email) == false) { return;}

        // Ahora algo siemple, despues validaciones como: [1-Mayuscula, 1-caracter especial]
        if (password.length < 8) {
            alert("La contraseña tiene que tener como minimo 8 caracteres");
            return;
        }

        const newUser = new Usuario(username, firstname, lastname, email, password);

        Storage.set("regDATAform", newUser);
        
        window.location.href = "../login/login.html";
    });
});