import { ProductService } from '../js/classes/ProductService.js';
import { rendererForm } from '../js/classes/rendererForm.js';

// Testing v0.1
document.addEventListener('DOMContentLoaded', async () => {
    const productos = await ProductService.loadProducts();
    const rndrForm = new rendererForm(productos, 'finalizar-compra');
    rndrForm.initRenderForm();
});