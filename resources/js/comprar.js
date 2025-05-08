import { ProductService } from '../js/classes/ProductService.js';
import { Storage } from '../js/classes/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  const productId = Storage.get('selectedProductId');
  const productModelo = Storage.get('selectedProductModelo');
  const compraContainer = document.getElementById('compra-container');
  
  if (productId && productModelo) {
    try {
        const loadAllPrdctsData = await ProductService.loadProducts(); // carga de productos
        
        // filtrar para encontrar el producto:
        // busca el idModelo y luego el id dentro del objeto del json productos
        const findPrdct = loadAllPrdctsData.find(categoria =>
            categoria.idModelo === productModelo &&
            categoria.productos.some(producto => producto.getId() === productId)
        )?.productos.find(producto => producto.getId() === productId);

        if (findPrdct) {
            compraContainer.innerHTML = `
                <div class="compra-detalle">
                    <h2>Detalles de la Compra</h2>
                    <p>producto id: ${findPrdct.getId()}</p>
                    <p>producto modelo: ${findPrdct.getModelo()}</p>
                    <p>producto marca: ${findPrdct.getMarca()}</p>
                    <p>producto nombre: ${findPrdct.getNombre()}</p>
                    <p>producto paid method: ${findPrdct.getPaidMethod()}</p>
                    <p>producto stocks disponibles: ${findPrdct.getStock()}</p>
                </div>
            `;
        } else {
            compraContainer.innerHTML = '<p>Error al cargar el elemento seleccionado, intete despues o comuniquese con el soporte --> [support] </p>';
        }
    } catch (error) {
        console.error('<p>Hubo un problema al cargar los productos</p>', error);
        compraContainer.innerHTML = '<p>Error al cargar el elemento seleccionado, intete despues o comuniquese con el soporte --> [support] </p>';
    }
  } else {
    compraContainer.innerHTML = '<p>No se ha seleccionado ningun producto</p>';
  }
});