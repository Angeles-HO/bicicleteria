import { Storage } from '../../js/classes/storage.js';

export class rendererForm {
    constructor(product, containerId) {
        this.product = product,
        this.container = document.getElementById(containerId)
        this.productId = Storage.get('selectedProductId');
        this.productModelo = Storage.get('selectedProductModelo');
        this.selectedPrdct = this.findPrdct(this.product, this.productModelo, this.productId)
        this.monedas = this.selectedPrdct.getIsCAE(this.selectedPrdct)
        this.productPrecio = this.monedas.map(monedaSlct => this.selectedPrdct.getPrecio(monedaSlct))
    } 

    // render 
    /* Render 2 secciones [detalles del producto y completar campos] */
    initRenderForm() {
        return this.container.innerHTML = `
            <form id="compra-container">
                ${this.renderProdCard()}
                ${this.renderProdOptCampos()}
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
            <p class="otros-detalles">Modelo: ${this.selectedPrdct.getModelo()}</p>
            <p class="otros-detalles">Marca: ${this.selectedPrdct.getMarca()}</p>
        `
    }

    renderProdClrs() {
        return `
            <p class="otros-detalles">Colores Disponibles:</p>
            <div class="color-options">
                ${this.selectedPrdct.getColores().map(color => 
                `<label class="color-aviables">
                    ${color.color}
                </label>`).join('')}
            </div>
        `
    }

    renderProdVarius() {
        return `
            <div class="cntrol-strock">
            <p class="otros-detalles">Cantidad de productos actualmente disponibles: ${this.selectedPrdct.getStock()}</p>
            </div>
            <div class="method-paid">
                <p class="otros-detalles">Metodos de Pago para este producto: ${this.selectedPrdct.getPaidMethod()}</p>
            </div>
            <span class="otros-detalles"> 
                Lista de Precios:
                ${this.monedas.map((moneda, indxVal) => `<ul class="lista-precio">- ${moneda}: $${this.productPrecio[indxVal]}</ul>`).join('')} <!-- join('') para sacar las comas generadas por default jsjs -->
            </span>
        `
    }

    renderProdOptCampos() {
        return `
            <div id="finalizar-prod" class="producto-detalles">
                ${this.renderSlctProdClrs()}
                ${this.renderSlctProdStock()}
                ${this.renderSlctProdEnvio()}
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
}