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
        const productPrecio = [findPrdct.getPrecio('ARS').toLocaleString('es-AR'), findPrdct.getPrecio('USD'), findPrdct.getPrecio('EUR')]

        if (findPrdct) {
            compraContainer.innerHTML = `
                <div class="compra-detalle">
                    <div class="producto-detalles">
                        <img class="product-img" src="${findPrdct.getImgSrc()}">
                        <h2 class="testeo">Detalles de la Compra</h2>
                        <div class="mas-detalles">
                            <p class="otros-detalles"><strong>Producto a Comprar:</strong> ${findPrdct.getNombre()}</p>
                            <p class="otros-detalles"><strong>Modelo:</strong> ${findPrdct.getModelo()}</p>
                            <p class="otros-detalles"><strong>Marca:</strong> ${findPrdct.getMarca()}</p>
                            <ul class="otros-detalles"> 
                                <strong>Lista de Precios:</strong>
                                <li class="lista-precio">ARS: $${productPrecio[0]}</li>
                                <li class="lista-precio">USD: $${productPrecio[1]}</li>
                                <li class="lista-precio">EUR: $${productPrecio[2]}</li>
                            </ul>
                            <p class="otros-detalles"><strong>Metodos de Pago para este producto:</strong> ${findPrdct.getPaidMethod()}</p>
                            <p class="otros-detalles"><strong>Cantidad de productos actualmente disponibles:</strong> ${findPrdct.getStock()}</p>
                        </div>
                    </div>

                    <div class="finalizar-compra">
                        <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis libero enim repellendus excepturi nesciunt cupiditate sapiente dignissimos cumque odit deleniti non dolores, quam tenetur recusandae reiciendis sint numquam iusto eius! </p>
                    </div>
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