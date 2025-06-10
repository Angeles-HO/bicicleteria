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
    const precio = rndrForm.productPrecio[0];
    const sumXcantidad = document.getElementById('cantidad')
    const efectivo3ros = document.getElementById('radios-pago-efectivo-3ros')
    const tarjeta3ros = document.getElementById('radios-pago-tarjeta-3ros');

    // Ayuda para manipulacion de DOM con codigo limpio
    const domHandler = new DOMhandler(selectPago, pago3ro, radios, precioTotal, metodoEnvio, txtRecargo, precio, sumXcantidad, efectivo3ros, tarjeta3ros);

    if(selectPago && pago3ro && radios.length) {
        selectPago.addEventListener('change', domHandler.checkShowExtra());
        radios.forEach(r => r.addEventListener('change', domHandler.checkShowExtra()));
    }

    if (precioTotal && metodoEnvio && txtRecargo) {
        metodoEnvio.addEventListener('change', function() {
            domHandler.rechargeSystem();
        });
    }

    if (sumXcantidad) {
        sumXcantidad.addEventListener('change', function() {
            domHandler.rechargeSystem();
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


