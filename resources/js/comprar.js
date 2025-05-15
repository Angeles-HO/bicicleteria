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
  const compraContainer = document.getElementById('finalizar-compra');
  
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
        // va joya
        const monedas = selectedPrdct.getIsCAE(selectedPrdct)
        const productPrecio = monedas.map(monedaSlct => selectedPrdct.getPrecio(monedaSlct))
        

        if (selectedPrdct) {
            compraContainer.innerHTML = `
                <form id="compra-container">
                    <div id="campos-prod" class="producto-detalles">
                        <div id="section-prod-image">
                            <img class="prod-img" src="${selectedPrdct.getImgSrc()}">
                        </div>
                        <h2 class="testeo">Detalles de la Compra</h2>
                        <div class="mas-detalles">
                            <p class="otros-detalles">Producto a Comprar: ${selectedPrdct.getNombre()}</p>
                            <p class="otros-detalles">Modelo: ${selectedPrdct.getModelo()}</p>
                            <p class="otros-detalles">Marca: ${selectedPrdct.getMarca()}</p>
                            <p class="otros-detalles">Elige un color:</p>
                            <div class="color-options">
                                ${selectedPrdct.getColores().map(color => 
                                `<label class="color-option">
                                    <input type="radio" name="color" value="${color.color}" required>
                                    <span class="color-preview" style="background-color: ${color.codigo}"></span>
                                    ${color.color}
                                </label>`).join('')}
                            </div>
                            <div class="cntrol-strock">
                                <p class="otros-detalles">Cantidad de productos actualmente disponibles: ${selectedPrdct.getStock()}</p>
                                <label>Cantidad:</label>
                                <input type="number" id="cantidad" min="1" max="${selectedPrdct.getStock()}" value="1" required>
                            </div>
                            <div class="method-paid">
                                <p class="otros-detalles">Metodos de Pago para este producto: ${selectedPrdct.getPaidMethod()}</p>
                                ${selectedPrdct.getPaidMethod().length === 1 ? `
                                <div class="one-paid-method">
                                    <input type="radio" name="paid" value="${selectedPrdct.getPaidMethod[0]}" checked>
                                    <label>${selectedPrdct.getPaidMethod()[0]}</label>
                                </div>
                                `:`
                                <div class="varius-paid-method">
                                    <p class="otros-detalles">Selecciona un metodo de pago:</p>
                                    ${selectedPrdct.getPaidMethod().map(mthd => `
                                        <input type="radio" name="paid" value="${mthd}">
                                        <label>${mthd}</label>    
                                    `)}
                                </div>
                                `}
                            </div>
                            <div class="method-envio">
                                <label>Metodo de Envio:</label>
                                <select id="metodo-envio" required>
                                    <option value="">Seleccione...</option>
                                    <option value="retiro-local">Retiro en Local</option>
                                    <option value="envio-domicilio">Envio a Domicilio</option>
                                </select>
                            </div>
                            <ul class="otros-detalles"> 
                                Lista de Precios:
                                ${monedas.map((moneda, indxVal) => `<li class="lista-precio">${moneda}: $${productPrecio[indxVal]}</li>`).join('')} <!-- join('') para sacar las comas generadas por default jsjs -->
                            </ul>
                        </div>
                    </div>

                    <!-- seleccion de datos para finalizar compra:
                        - recibir colores y seleccionar color final de compra
                        - cantidad a comprar (teniendo en cuenta el stock)
                        - retirar: [Envio, Local]
                        - metodo de pago (usando classe Product getPaidMethod(), ej: "paidMethod": ["efectivo"] o ["efectivo", "tarjeta"])
                    -->
                    <div id="campos-prod"  class="completar-campos">
                        <!-- test de ajuste de width responsive (dnmyc) -->
                        <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis libero enim repellendus excepturi nesciunt cupiditate sapiente dignissimos cumque odit deleniti non dolores, quam tenetur recusandae reiciendis sint numquam iusto eius! </p>
                    </div>
                </form>
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