import { Storage } from '../js/classes/storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Intentemos mejorar el apartado visual e interactivo en HOME y despues en otros *.js
    // Verifiquemos si el usuario esta logeado
    // test para evitar que se muestre [Login/register] si ya esta logeado
    const isLogged = Storage.get("sessionActive");
    const navCntinr = document.querySelector(".page-navegation");
    const carrito = document.querySelector(".carrito-container");

    // Comprabacion simple si los elementos no existes
    if (!navCntinr || !carrito) return;

    // Links de referencia
    const regLink = document.querySelector('a[href="../register/register.html"]')
    const logLink = document.querySelector('a[href="../login/login.html"]')  
    const carrito2 =  document.querySelector('a[href="../store/store.html"]')

    if (isLogged) {
        // Obtener usuario ya logueado
        const usrnm = Storage.get("sessionUser");

        // Crear elemento span para renderizarlo en otro momento
        const unspan = document.createElement("span");
        unspan.textContent = `${usrnm}` // le damos el dato de name de usuario
        unspan.className = "encapsular" // clase con estilos ya asignados

        // Enlace de logout / cerrar sesion
        const logOL = document.createElement('a');
        logOL.className = "encapsular"; // Classe
        logOL.textContent = "Logout"; // Nombre del boton
        logOL.href = "../home/index.html"; // Donde te manda

        // Le agregamos un evento cuando le demos click al enlace
        logOL.addEventListener("click", (e) => {

            // que no se recargue la oagina
            e.preventDefault()

            Storage.logOut();
            // Metodo que borra los datos ir a storage.js para mas detalles
            window.location.href = "../home/index.html"; // recarga
        });
        
        // Eliminar enlaces de registro y login si existen
        // Da un toque mas profesional
        if (regLink) regLink.remove();
        if (logLink) logLink.remove();

        // Insertar el nombre del usuario y el enlace de logout en la navegacion
        navCntinr.insertBefore(unspan, carrito.nextSibling);
        navCntinr.insertBefore(logOL, unspan.nextSibling);
        console.log(Storage.keys())
    } else {
        // Evento cuando el usuario no esta logeado

        // Para evitar un pre-frame de la tienda antes de que envie al register si no estas logeado
        carrito2.addEventListener("click", (e) => {
            e.preventDefault()
            window.location.href = "../register/register.html"
        })
        
        
        // Crear un enlace de registro si no existe
        if (!regLink) {
            const newRegLink = document.createElement("a");
            newRegLink.href = "../register/register.html"
            newRegLink.className = "encapsular";
            newRegLink.textContent = "register";
            navCntinr.appendChild(newRegLink);
        }

        // Crear un enlace de login si no existe
        if (!logLink) {
            const newLogLink = document.createElement("a");
            newLogLink.href = "../login/login.html"
            newLogLink.className = "encapsular";
            newLogLink.textContent = "login";
            navCntinr.appendChild(newLogLink);
        }
    }
});