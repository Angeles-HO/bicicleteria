import { ProductService } from '../js/classes/ProductService.js';
import { Storage } from '../js/classes/storage.js';

// Testing v0.1

/**
    @param {Array<Object>} data - Recibir los datos cargados del json, cada objt es una categoria
    @param {string} productModelo - Categoria donde esta actualmente el producto (ej: "MTB" o [{"idModelo": "MTB"},{"idModelo": "BMX"}])
    @param {string|number} productId - Id (posicion) donde estan los datos del producto (ej: 5 o [{"idModelo": "MTB", "productos":[{"id": 1},{"id": 2}]}])
*/

function findPrdct(data, productModelo, productId) {
    return data.find(categoria => 
        categoria.idModelo === productModelo && categoria.productos.some(producto => 
            producto.getId() === productId)
        )?.productos.find(producto => 
            producto.getId() === productId
    );
}

document.addEventListener('DOMContentLoaded', async () => {
  const productId = Storage.get('selectedProductId');
  const productModelo = Storage.get('selectedProductModelo');
  const compraContainer = document.getElementById('compra-container');
  
  if (productId && productModelo) {
    try {
        const loadAllPrdctsData = await ProductService.loadProducts(); // carga de productos
        
        // filtrar para encontrar el producto:
        // busca el idModelo y luego el id dentro del objeto del json productos
        // Variable renombrada, no tuve en cuenta lo del mismo nombre de variable y funcion
        // primera llamada funcionaba bien pero luego en una segunda daba undefined u objt dependiendo de lo que hacia
        const selectedPrdct = findPrdct(loadAllPrdctsData, productModelo, productId)

        // test v0.2
        // veamos como va con map ["ARS", "USD", "EUR"]
        const monedas = selectedPrdct.getIsCAE(selectedPrdct)
        const productPrecio = monedas.map(monedaSlct => selectedPrdct.getPrecio(monedaSlct))
        

        if (selectedPrdct) {
            compraContainer.innerHTML = `
                <div class="compra-detalle">
                    <div class="producto-detalles">
                        <img class="product-img" src="${selectedPrdct.getImgSrc()}">
                        <h2 class="testeo">Detalles de la Compra</h2>
                        <div class="mas-detalles">
                            <p class="otros-detalles"><strong>Producto a Comprar:</strong> ${selectedPrdct.getNombre()}</p>
                            <p class="otros-detalles"><strong>Modelo:</strong> ${selectedPrdct.getModelo()}</p>
                            <p class="otros-detalles"><strong>Marca:</strong> ${selectedPrdct.getMarca()}</p>
                            <!-- testeo de lista de carga dinamica de moneda existente -->
                            <ul class="otros-detalles"> 
                                <strong>Lista de Precios:</strong>
                                ${monedas.map((moneda, indxVal) => `<li class="lista-precio">${moneda}: $${productPrecio[indxVal]}</li>`).join('')} <!-- join('') para sacar las comas generadas por default jsjs -->
                            </ul>
                            <p class="otros-detalles"><strong>Metodos de Pago para este producto:</strong> ${selectedPrdct.getPaidMethod()}</p>
                            <p class="otros-detalles"><strong>Cantidad de productos actualmente disponibles:</strong> ${selectedPrdct.getStock()}</p>
                        </div>
                    </div>

                    <!-- seleccion de datos para finalizar compra:
                        - recibir colores y seleccionar color final de compra
                        - cantidad a comprar (teniendo en cuenta el stock)
                        - retirar: [Envio, Local]
                        - metodo de pago (usando classe Product getPaidMethod(), ej: "paidMethod": ["efectivo"] o ["efectivo", "tarjeta"])
                    -->
                    <div class="finalizar-compra">
                        <!-- test de ajuste de width responsive (dnmyc) -->
                        <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis libero enim repellendus excepturi nesciunt cupiditate sapiente dignissimos cumque odit deleniti non dolores, quam tenetur recusandae reiciendis sint numquam iusto eius! </p>
                    </div>
                </div>
            `;
        } else {
            compraContainer.innerHTML = '<p>Error al cargar el elemento seleccionado, intete despues o comuniquese con el soporte --> [support] </p>';
        }
    } catch (error) {
        // limpiar etiquetas de testeo (copy pega para evitar escribir lo mismo)
        console.error('Hubo un problema al cargar los productos', error);
        compraContainer.innerHTML = '<p>Error al cargar el elemento seleccionado, intete despues o comuniquese con el soporte --> [support] </p>';
    }
  } else {
    compraContainer.innerHTML = '<p>No se ha seleccionado ningun producto</p>';
  }
});