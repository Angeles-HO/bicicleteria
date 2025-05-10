// Importar la clase ProductService desde el archivo productService.js
import { ProductService } from '../js/classes/ProductService.js';
import { Storage } from '../js/classes/storage.js';
// Esperar a que el DOM este completamente cargado antes de ejecutar el codigo
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Intenta cargar los datos de los productos desde un archivo JSON con los datos de las bicicletas
    // Se utiliza fetch para obtener los datos de un archivo JSON
    // El archivo JSON contiene un array de objetos, cada uno representando una categoria de productos
    const CandP = await ProductService.loadProducts(); // Carga los productos utilizando la clase ProductService

    // Renderiza los productos en la pagina
    renderProductos(CandP);

    // Configura los filtros para filtrar los productos
    setupFilters(CandP);

  } catch (error) {
    // Si ocurre un error, lo muestra en la consola y en la interfaz
    console.error('Error:', error);
    document.getElementById('productos-container').innerHTML = `
      <div class="error-message">
        <p>No se pudieron cargar los productos. Por favor intenta mas tarde.</p>
      </div>
    `;
  }
});

// test v0.1
function betterCTLstrg(value, moneda, producto) {
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

// Configura los filtros para filtrar los productos segun el modelo y el metodo de pago
function setupFilters(data) {
  // Obtiene los elementos del DOM para los filtros de modelo y metodo de pago
  const filtroModelo = document.getElementById('filtro-modelo'); // Selector para filtrar por modelo
  const filtroPago = document.getElementById('method-paid-container'); // Selector para filtrar por metodo de pago

  // Verifica si el filtro de modelo ya tiene opciones cargadas
  if (filtroModelo.innerHTML === '') {
    // Extrae los modelos unicos de las categorias en los datos
    // Crear un array con valores unicos de idModelo
    const modelosUnicos = [...new Set(data.map(cat => cat.idModelo))];
    modelosUnicos.forEach(modelo => {
      // Agrega cada modelo como una opcion en el filtro de modelo
      filtroModelo.innerHTML += `<option value="${modelo}">${modelo}</option>`;
    });
  }

  // Verifica si el filtro de metodo de pago ya tiene opciones cargadas
  if (filtroPago.innerHTML === '') {
    const metodosPago = new Set(); // Crea un conjunto para almacenar metodos de pago unicos
    data.forEach(cat => {
      // Itera sobre cada categoria y sus productos
      cat.productos.forEach(prod => {
        // Agrega cada metodo de pago del producto al conjunto
        prod.paidMethod.forEach(m => metodosPago.add(m));
      });
    });
    metodosPago.forEach(metodo => {
      // Agrega cada metodo de pago como una opcion en el filtro de metodo de pago
      filtroPago.innerHTML += `<option value="${metodo}">${metodo}</option>`;
    });
  }

  // Funcion que maneja los cambios en los filtros
  const handleFilterChange = () => {
    // Obtiene los valores seleccionados en los filtros
    const modeloSeleccionado = filtroModelo.value; // Valor seleccionado en el filtro de modelo
    const metodoPagoSeleccionado = filtroPago.value; // Valor seleccionado en el filtro de metodo de pago

    // Filtra las categorias y sus productos segun los filtros seleccionados
    const productosFiltrados = data.map(categoria => {
      // Filtra los productos de la categoria por metodo de pago si se selecciono uno especifico
      let productos = categoria.productos;
      if (metodoPagoSeleccionado !== 'todos') {
        productos = productos.filter(producto => 
          producto.paidMethod.includes(metodoPagoSeleccionado) // Incluye solo los productos que soportan el metodo de pago seleccionado
        );
      }

      // Verifica si la categoria debe incluirse segun el modelo seleccionado
      if (modeloSeleccionado !== 'todos' && categoria.idModelo !== modeloSeleccionado) {
        return null; // Excluye esta categoria si no coincide con el modelo seleccionado
      }

      // Devuelve una copia de la categoria con los productos filtrados
      return {
        ...categoria, // Copia las propiedades de la categoria original
        productos: productos // Incluye solo los productos filtrados
      };
    }).filter(categoria => categoria !== null && categoria.productos.length > 0); // Excluye categorias vacias o nulas

    // Renderiza los productos filtrados en la pagina
    renderProductos(productosFiltrados);
  };

  // Agrega eventos de cambio a los filtros para ejecutar la funcion de filtrado
  filtroModelo.addEventListener('change', handleFilterChange); // Ejecuta el filtrado al cambiar el modelo
  filtroPago.addEventListener('change', handleFilterChange); // Ejecuta el filtrado al cambiar el metodo de pago
}

// Renderiza los productos en la pagina
function renderProductos(categorias) {
  const container = document.getElementById('productos-container'); // Contenedor principal de los productos
  
  // Si no hay categorias o estan vacias, muestra un mensaje de "sin resultados"
  if (!categorias || categorias.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <h1>No se encontraron productos con los filtros seleccionados.</h1>
      </div>
    `;
    return;
  }

  container.innerHTML = ''; // Limpia el contenedor antes de renderizar nuevamente

  // Itera sobre cada categoria para renderizar sus productos
  categorias.forEach(categoria => {
    // Crea un contenedor para la categoria
    const categoriaSection = document.createElement('section');
    categoriaSection.className = 'categoria-section';
    
    // Crea un titulo para la categoria
    const tituloCategoria = document.createElement('h2');
    tituloCategoria.className = 'categoria-titulo';

    categoriaSection.appendChild(tituloCategoria); // Agrega el titulo al contenedor de la categoria
    
    // Crea un contenedor para los productos de la categoria
    const productosGrid = document.createElement('div');
    productosGrid.className = 'productos-grid';
    
    // Itera sobre los productos de la categoria
    categoria.productos.forEach(producto => {
      // Una verificacion
      if (!producto) {
        console.warn("producto no cargado")
        return;
      }
      // Obtiene los precios en USD y ARS del producto
      // Nueva implementacion de busqueda y accesso
      const monedas = producto.getIsCAE(producto);

      // Agrupar todo en uno y vitar multiples llamados 
      const detallesPPM = monedas.map(moneda => ({
        moneda,
        precio: producto.getPrecio(moneda),
        descuento: producto?.getDescuento(moneda),
        PcD: producto.getCalcularDescuento(moneda)
      }));


      
      // Crea el HTML para cada producto
      const productoHTML = `
        <div class="producto-card" data-id="${producto.getId()}">
          <div class="producto-imagen-container">
            <img src="..${producto.getImgSrc()}" alt="${producto.getDescripcion()}" class="producto-imagen" onerror="this.src='../../resources/imgs/bsotd.jpg'">
            ${producto.getStock() > 0 && producto.getStock() <= 3 ? '<span class="stock-badge">¡ultimas unidades!</span>' : ''} <!-- Muestra un badge si el stock es bajo -->
          </div>
          <div class="producto-info">
            <!-- Datos del producto -->
            <p class="producto-marca">${producto.getMarca()}</p>
            <p class="producto-nombre">${producto.getNombre()}</p>
            <p class="producto-descripcion">${producto.getDescripcion()}</p>
            
            <!-- Encontrar datos y mostrarlos -->
            <div class="producto-meta">
              <div class="colores">
              ${producto.getColores().map(color => `
                <span style="background-color: ${color.codigo};" title="${color.color}"></span>
              `).join('')}
              </div>
              
              <div class="metodos-pago">
                ${producto.getPaidMethod().map(metodo => `
                  <span class="metodo-pago ${metodo}">${metodo}</span>
                `).join('')}
              </div>
            </div>

            <!-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat -->
            <!-- algo confuso pero que funciona -->
            <div class="producto-precios">
                ${detallesPPM.map(({moneda, precio, descuento, PcD}) => `
                  <div class="lista-precio">
                    ${moneda}: ${precio === '' ? "": betterCTLstrg(precio, moneda, producto)}
                    <span class="descuento">
                      ${descuento === '' ? "": "-"+descuento+"%"}
                    </span>
                    ${PcD === 0 ? "": "<p> -P final: " + betterCTLstrg(PcD, moneda, producto)
                    +"</p>"}
                  </div>
                `).join("")}
            </div>
            
            <!-- Sistema de comprobacion stock -->
            <div class="producto-acciones">
              <span class="stock ${producto.getStock() > 0 ? 'en-stock' : 'agotado'}">
                ${producto.getStock() > 0 ? '🟢 En stock' : '🔴 Agotado'} <!-- Muestra si el producto esta en stock o agotado -->
              </span>

              <!-- Fix de envio de datos -->
              <button class="btn-comprar" data-id="${producto.getId()}" data-idmodelo="${producto.getIdModelo()}">
                COMPRAR 
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Agrega el producto al contenedor de productos
      productosGrid.insertAdjacentHTML('beforeend', productoHTML);
    });
    
    // Agrega el contenedor de productos a la categoria
    categoriaSection.appendChild(productosGrid);
    container.appendChild(categoriaSection); // Agrega la categoria al contenedor principal
  });
  
  // Configura los eventos de los botones de compra
  setupBuyButtons();
}

// Configura los eventos de los botones de compra
function setupBuyButtons() {
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

      // Redirige a la página de compra
      window.location.href = '../../main/comprar/comprar.html';
    });
  });
}