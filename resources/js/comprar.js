import { ProductService } from '../js/classes/ProductService.js';
import { rendererForm } from '../js/classes/rendererForm.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productos = await ProductService.loadProducts();
    const rndrForm = new rendererForm(productos, 'finalizar-compra');
    rndrForm.initRenderForm();
    const msgSccs = document.getElementById('compra-container')

    msgSccs.addEventListener('submit', function(e){
        e.preventDefault()
        alert("Compra realizada")
        window.location.href = "../store/store.html"
    })
});