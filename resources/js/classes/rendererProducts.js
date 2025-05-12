import { Storage } from "../classes/storage.js";

export class renderProd {
    constructor(containerId = 'productos-container') {
        this.container = document.getElementById(containerId);
    }

    rendererMain(categorias) {
        // Si no hay categorias o estan vacias, muestra un mensaje de "sin resultados"
        if (!categorias || categorias.length === 0) {
          return this.PrdNotFound();
        }

        // Limpia el contenedor antes de renderizar nuevamente
        this.container.innerHTML = '';
        
        // Itera sobre cada categoria para renderizar sus productos
        categorias.forEach(cat => 
            this.renderCat(cat)
        );
        this.setupBuyButtons();
    }

    PrdNotFound() {
        this.container.innerHTML = `
        <div class="no-results">
          <h1>No se encontraron productos con los filtros seleccionados.</h1>
        </div>`;
    }

    renderCat(cat) {
        // Crea un contenedor para la categoria
        const categoriaSection = document.createElement('section');
        categoriaSection.className = 'categoria-section';

        // Crea un titulo para la categoria
        const tituloCategoria = document.createElement('h2');
        tituloCategoria.className = 'categoria-titulo';
        tituloCategoria.innerText = cat.idModelo;

        // Crea un contenedor para los productos de la categoria
        const productosGrid = document.createElement('div');
        productosGrid.className = 'productos-grid';

        cat.productos.forEach(prod => {
            // Una verificacion
            if (!prod) return console.warn('producto no cargado');

            const cardProdHTML = this.generateCardProd_x_Element(prod);
            productosGrid.insertAdjacentHTML('beforeend', cardProdHTML);
        });
        categoriaSection.appendChild(productosGrid);
        this.container.appendChild(categoriaSection);
    }

    betterCTLstrg(value, moneda, producto) {
        const srchRegion = producto.getRegion(moneda);
        const srchCurrency = producto.getCurrency(srchRegion);
        try { 
          return Intl.NumberFormat(srchRegion, {
          style: 'currency',
          currency: srchCurrency,
          minimumFractionDigits: 0
        }).format(value);
        } catch (error) {
          console.warn(`Formato invalido para ${moneda} con ${srchRegion}`, error)
          return value;
        }
    }

    generateCardProd_x_Element(producto) {
        // Obtiene los precios en USD y ARS del producto
        // Nueva implementacion de busqueda y accesso
        const monedas = producto.getIsCAE();

        // Agrupar todo en uno y vitar multiples llamados 
        const detallesPPM = monedas.map(moneda => ({
            moneda,
            precio: producto.getPrecio(moneda),
            descuento: producto?.getDescuento(moneda),
            PcD: producto.getCalcularDescuento(moneda)
        }));

        return `
        <div class="producto-card" data-id="${producto.getId()}">
            <div class="producto-imagen-container">
                <img src="..${producto.getImgSrc()}" alt="${producto.getDescripcion()}" class="producto-imagen"
                onerror="this.src='../../resources/imgs/bsotd.jpg'">
                ${producto.getStock() > 0 && producto.getStock() <= 3 ? '<span class="stock-badge">¡ultimas unidades!</span>' : ''}
            </div>
            <div class="producto-info">
                <p class="producto-marca">${producto.getMarca()}</p>
                <p class="producto-nombre">${producto.getNombre()}</p>
                <p class="producto-descripcion">${producto.getDescripcion()}</p>
                <div class="producto-meta">
                    <div class="colores">
                        <p class="colores-disponibles">Colores Disponibles</p>
                        ${producto.getColores().map(color => `
                          <span style="background-color: ${color.codigo};" title="${color.color}"></span>
                        `).join('')}
                    </div>
                    <div class="metodos-pago">
                        ${producto.getPaidMethod().map(m => `<span class="metodo-pago ${m}">${m}</span>`).join('')}
                    </div>
                </div>
                <div class="producto-precios">
                    ${detallesPPM.map(({ moneda, precio, descuento, PcD }) => `
                    <div class="lista-precio">
                        ${moneda}: ${precio === '' ? "" : this.betterCTLstrg(precio, moneda, producto)}
                        <span class="descuento">${descuento === '' ? "" : "-" + descuento + "%"}</span>
                        ${PcD === 0 ? "" : `<p>-P final: ${this.betterCTLstrg(PcD, moneda, producto)}</p>`}
                    </div>
                    `).join("")}
                </div>
                <div class="producto-acciones">
                    <span class="stock ${producto.getStock() > 0 ? 'en-stock' : 'agotado'}">
                      ${producto.getStock() > 0 ? '🟢 En stock' : '🔴 Agotado'}
                    </span>
                    <button class="btn-comprar" data-id="${producto.getId()}" data-idmodelo="${producto.getIdModelo()}">
                      COMPRAR
                    </button>
                </div>
            </div>
        </div>
    `;
    }

    setupBuyButtons() {
        document.querySelectorAll('.btn-comprar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = e.target.dataset.id; // Obtiene el ID del producto
                const productModelo = e.target.dataset.idmodelo; // Obtiene el ID del modelo
                console.log('Product ID:', productId);
                console.log('Product Modelo:', productModelo);
    
                if (!productModelo) {
                  console.error('El atributo data-idModelo no está definido en el botón.');
                }
    
                // Guarda los datos con la ayuda de la clase Storage
                Storage.set('selectedProductId', productId);
                Storage.set('selectedProductModelo', productModelo);
    
                // Redirige a la pagina de compra
                window.location.href = '../../main/comprar/comprar.html';
            });
        });
    }
}