import { ProductService } from '../js/classes/ProductService.js';
import { rendererForm } from '../js/classes/rendererForm.js';
import { DOMhandler } from '../js/classes/DOMhandler.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar productos
    const productos = await ProductService.loadProducts();

    // Render main constructor
    const rndrForm = new rendererForm(productos, 'finalizar-compra');

    // Init form finalizar compra
    rndrForm.initRenderForm();

    // Search IDs section
    const selectPago = document.getElementById('pagar-en');
    const pago3ro = document.getElementById('extra-pago-tercero');
    const radios = document.getElementsByName('paid');
    const precioTotal = document.getElementById('precio-total');
    const metodoEnvio = document.getElementById('metodo-envio');
    const txtRecargo = document.getElementById('text-recargo');

    // Ayuda para manipulacion de DOM con codigo limpio
    const domHandler = new DOMhandler(selectPago, pago3ro, radios);

    if(selectPago && pago3ro && radios.length) {
        selectPago.addEventListener('change', domHandler.checkShowExtra());
        radios.forEach(r => r.addEventListener('change', domHandler.checkShowExtra()));
    }
    
    if (precioTotal && metodoEnvio && txtRecargo) {
        metodoEnvio.addEventListener('change', function() {
            const precio = rndrForm.productPrecio[0];
            const calculoRecargo = (precio / 100) * 2; // Ejemplo de recargo del 10%
            const envio = this.value === 'retiro-local' ? 0 : calculoRecargo; // Ejemplo de costo de envio
            const total = precio + envio;
            domHandler.toggleRecargoDisplay(this.value !== 'retiro-local');
            domHandler.updatePrecioTotal(total, precio, envio);
        });
    }

    // Alerta finalizar compra
    const msgSccs = document.getElementById('compra-container');
    msgSccs.addEventListener('submit', function(e){
        e.preventDefault()
        alert("Compra realizada")
        window.location.href = "../store/store.html"
    })
});


