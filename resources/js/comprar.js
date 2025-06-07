import { ProductService } from '../js/classes/ProductService.js';
import { rendererForm } from '../js/classes/rendererForm.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar productos
    const productos = await ProductService.loadProducts();
    // Render
    const rndrForm = new rendererForm(productos, 'finalizar-compra');

    // Init form finalizar compra
    rndrForm.initRenderForm();
    
    // Mostrar campoa rellenar
    const selectPago = document.getElementById('pagar-en');
    const pago3ro = document.getElementById('extra-pago-tercero');
    const radios = document.getElementsByName('paid');

    function checkShowExtra() {
        let pagoSeleccionado = 'efectivo';
        radios.forEach(r => { if(r.checked) pagoSeleccionado = r.value; });
        if(selectPago.value === 'tercero' && pagoSeleccionado.toLowerCase().includes('tarjeta')) {
            pago3ro.style.display = 'block';
        } else {
            pago3ro.style.display = 'none';
        }
    }
    
    if(selectPago && pago3ro && radios.length) {
        selectPago.addEventListener('change', checkShowExtra);
        radios.forEach(r => r.addEventListener('change', checkShowExtra));
    }

    // Alerta finalizar compra
    const msgSccs = document.getElementById('compra-container');
    msgSccs.addEventListener('submit', function(e){
        e.preventDefault()
        alert("Compra realizada")
        window.location.href = "../store/store.html"
    })
});



