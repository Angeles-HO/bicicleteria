import { Storage } from "../js/classes/storage.js"

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.login-form');

    formulario.addEventListener('submit', function(e) {
        e.preventDefault()
        const usrnmInput = document.getElementById('username').value.trim();
        const emailInput = document.getElementById('email').value.trim();
        const psswrdInput = document.getElementById('password').value.trim();

        // Varificar si se recibe correctamente el usuario registrado o si no existe
        if (!Storage.TKAE("regDATAform")) {
            alert("No se encontro en usuario registrado")
            return;
        }

        // Recibir y almacenar los datos de una variable
        const userDATA = Storage.get("regDATAform");

        // Verificar que los datos del login sean validos
        const ValidateLogin = userDATA._username === usrnmInput &&
        userDATA._email === emailInput &&
        userDATA._password === psswrdInput;

        if (ValidateLogin) {
            // Test para mantener el inicio de sesion
            Storage.set("sessionActive", true)
            Storage.set("sessionUser", usrnmInput)

            // Log para depuracion
            alert("El inicio de sesion fue un exito redirigiendo al inicio")
            window.location.href = "../home/index.html"
        } else {
            alert("Nombre de usuario, email o contraseña incorrectos")
        }
    })
});