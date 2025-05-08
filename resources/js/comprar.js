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
                    <div class="producto-detalles">
                        <img class="product-img" src="${findPrdct.getImgSrc()}">
                        <h2>Detalles de la Compra</h2>
                        <div class="mas-detalles">
                            <p class="otros-detalles">Producto a Comprar: ${findPrdct.getNombre()}</p>
                            <p class="otros-detalles">Modelo: ${findPrdct.getModelo()}</p>
                            <p class="otros-detalles">Marca: ${findPrdct.getMarca()}</p>
                            <ul class="otros-detalles>Precio: 
                                <li class="lista-precio">ARS: $${findPrdct.getPrecio('ARS').toLocaleString('es-AR')}</li>
                                <li class="lista-precio">USD: $${findPrdct.getPrecio('USD')}</li>
                                <li class="lista-precio">EUR: $${findPrdct.getPrecio('EUR')}</li>
                            </ul>
                            <p class="otros-detalles>Metodos de Pago para este producto : ${findPrdct.getPaidMethod()}</p>
                            <p class="otros-detalles>Cantidad de productos actualmente disponibles: ${findPrdct.getStock()}</p>
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