import { ProductService } from '../js/classes/ProductService.js';
import { rendererForm } from '../js/classes/rendererForm.js';


document.addEventListener('DOMContentLoaded', () => {
    const pressSubmit = document.getElementById('btn-finish-him');
    if (pressSubmit) {
        return alert("Work");
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    const productos = await ProductService.loadProducts();
    const rndrForm = new rendererForm(productos, 'finalizar-compra');
    rndrForm.initRenderForm();
});