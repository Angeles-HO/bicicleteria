import { Storage } from '../services/storage.js';
import { Precio } from '../models/Precio.js';

export class rendererForm {
    constructor(product, containerId) {
        this.product = product,
        this.container = document.getElementById(containerId),
        this.productId = Storage.get('selectedProductId'),
        this.productModelo = Storage.get('selectedProductModelo'),
        this.selectedPrdct = this.findPrdct(this.product, this.productModelo, this.productId),
        this.monedas = this.selectedPrdct.getIsCAE(),
        this.productPrecio = this.monedas.map(moneda => {
          const precio = this.selectedPrdct.getPrecio(moneda);
          const descuento = this.selectedPrdct.getDescuento(moneda);
          const region = this.selectedPrdct.getRegion(moneda);
          return new Precio({
            moneda,
            precio,
            descuento,
            region
          });
        });
    } 
    
    // render 
    /* Render 2 secciones [detalles del producto y completar campos] */
    initRenderForm() {
        return this.container.innerHTML = `
            <form id="compra-container">
                <div id="encapsular">
                    ${this.renderProdCard()}
                    ${this.renderProdOptCampos()}
                </div>
                <button type="submit" id="btn-finish-him" class="btn-finalizar">Finalizar Compra</button>
            </form>
        `;
    }

    renderProdCard() {
        return `
            <div id="campos-prod" class="producto-detalles">
                ${this.renderProdImg()}
                <h2 class="H2">Detalles de la Compra</h2>
                ${this.renderProdDetails()}
            </div>
        `
    }

    renderProdImg() {
        return `
            <div id="section-prod-image">
                <img class="prod-img" src="${this.selectedPrdct.getImgSrc()}">
            </div>
        `
    }

    renderProdDetails() {
        return `
            <div class="mas-detalles">
                ${this.renderProdTxt()}
                ${this.renderProdClrs()}
                ${this.renderProdVarius()}
            </div>
        `
    }

    renderProdTxt() {
        return `
            <p class="otros-detalles">Producto a Comprar: ${this.selectedPrdct.getNombre()}</p>
            <p class="otros-detalles"><strong>Modelo</strong>: ${this.selectedPrdct.getModelo()}</p>
            <p class="otros-detalles"><strong>Marca</strong>: ${this.selectedPrdct.getMarca()}</p>
        `
    }

    renderProdClrs() {
        return `
            <p class="otros-detalles"><strong>Colores Disponibles:</strong></p>
            <div class="color-options">
                ${this.selectedPrdct.getColores().map(color => 
                `<label class="color-aviables">
                    ${color.color}
                </label>`).join('')}
            </div>
        `
    }

    renderProdOptCampos() {
        return `
            <div id="finalizar-prod" class="producto-detalles">
                ${this.renderSlctProdClrs()}
                ${this.renderSlctProdStock()}
                ${this.renderSlctPaid()}
                ${this.renderSlctProdEnvio()}
                ${this.calcularPrecioFinal()}
            </div>
        `
    }

    renderSlctProdClrs() {
        return `
            <div class="slct-clr-buy">
                <p>Selecciona el color del modelo:</p>
                ${this.selectedPrdct.getColores().map(color => 
                `<label class="color-aviables">
                    <input type="radio" name="color" value="${color.color}" required>
                    <span class="color-preview" style="background-color: ${color.codigo}"></span>
                    ${color.color}
                </label>`).join('')}
            </div>
        `
    }

    renderSlctProdStock() {
        return `
            <label for="cantidad">Cantidad:</label>
            <input type="number" id="cantidad" min="1" max="${this.selectedPrdct.getStock()}" value="1" required>
            ${this.selectedPrdct.getPaidMethod().length === 1 ? `
                <div class="one-paid-method">
                    <label class="otros-detalles">Unico Metodo de pago disponible:</label>
                    <input type="radio" name="paid" value="${this.selectedPrdct.getPaidMethod()[0]}" checked>
                    <label>${this.selectedPrdct.getPaidMethod()[0]}</label>
                </div>
                `:`
                <div class="varius-paid-method">
                    <p class="otros-detalles">Selecciona un metodo de pago:</p>
                    ${this.selectedPrdct.getPaidMethod().map(mthd => `
                        <input type="radio" name="paid" value="${mthd}">
                        <label>${mthd}</label>    
                    `).join('')}
                </div>
            `}
        `
    }

    renderSlctPaid() {
        return `
            <div>
                <select id="pagar-en" required>
                    <option value="local">pago en el local</option>
                    <option value="tercero">En un tercero</option>
                </select>
            </div>
            <div id="extra-pago-tercero" style="display:none;">
                <label for="datos-tercero">Datos para pago en tercero (solo si es tarjeta):</label>
                <input type="text" id="datos-tercero" name="datos-tercero" placeholder="Nombre del tercero o referencia">
            </div>
            <div class="radios-pago-tarjeta-3ros" style="display:none;">
                <select id="pago-para-tarjeta" required>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta-debito">Tarjeta de Debito</option>
                    <option value="tarjeta-credito">Tarjeta de Credito</option>
                </select>
            </div>
            <div class="radios-pago-efectivo-3ros" style="display:none;">
                select id="pago-para-efectivo" required>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="mercado-pago">Mercado Pago</option>
                    <option value="paypal">PayPal</option>
                </select>
            </div>
        `
    }

    renderSlctProdEnvio() {
        return `
            <div class="method-envio">
                <label>Metodo de Envio:</label>
                <select id="metodo-envio" required>
                    <option value="retiro-local">Retiro en Local</option>
                    <option value="envio-domicilio">Envio a Domicilio</option>
                </select>
            </div>
        `
    }

    findPrdct(data, productModelo, productId) {
        return data.find(categoria => 
            categoria.idModelo === productModelo && categoria.productos.some(producto => 
                producto.getId() === productId)
            )?.productos.find(producto => 
                producto.getId() === productId
        );
    }

    renderProdVarius() {
        const preciosHTML = this.productPrecio.map(pre => {
            return `<li class="lista-precio">- ${pre.getMoneda()}: ${pre.getMonto()}</li>`;
        }).join('');

        return `
            <div class="cntrol-strock">
                <p class="otros-detalles"><strong>Stock:</strong> ${this.selectedPrdct.getStock()}</p>
            </div>
            <div class="method-paid">
                <p class="otros-detalles"><strong>Metodos de Pago para este producto:</strong> ${this.selectedPrdct.getPaidMethod()}</p>
            </div>
            <span class="otros-detalles"> 
                Lista de Precios:
                <ul>
                    ${preciosHTML}
                </ul>
            </span>
        `;
    }

    calcularPrecioFinal() {
        const preciosHTML = this.productPrecio.map(pre => {
            return `<p>${pre.getMoneda()}: ${pre.getMonto()}</p>`;
        }).join('');

        return ` 
            <div id="precio-final-txt" class="precio-final">Precio Total:
                ${preciosHTML}
                <span id="text-recargo" style="display:none;font-size:0.6em;">(incluye recargo por envío)</span>
            </div>
        `;
    }
}