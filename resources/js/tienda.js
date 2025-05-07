// Importar la clase ProductService desde el archivo productService.js
import { ProductService } from '../js/classes/ProductService.js';
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

// Configura los filtros para filtrar los productos segun el modelo y el metodo de pago
function setupFilters(data) {
  const filtroModelo = document.getElementById('filtro-modelo'); // Selector para filtrar por modelo en el html
  const filtroPago = document.getElementById('method-paid-container'); // Selector para filtrar por metodo de pago
  
  // Funcion que maneja los cambios en los filtros
  const handleFilterChange = () => {
    // Obtiene los valores seleccionados en los filtros
    const modeloSeleccionado = filtroModelo.value;
    const metodoPagoSeleccionado = filtroPago.value;
  
    // Crear una copia profunda de los datos originales para evitar mutaciones
    // Se utiliza JSON.parse y JSON.stringify para crear una copia profunda del objeto
    // Esto es necesario para evitar que los cambios en los filtros afecten a los datos originales
    // JSON.parse convierte el objeto en una cadena JSON y luego JSON.stringify lo convierte de nuevo en un objeto
    const datosFiltrados = JSON.parse(JSON.stringify(data));

    // Sistema de filtrado
    const productosFiltrados = datosFiltrados.filter(categoria => {

      // Filtrar por modelo
      if (modeloSeleccionado !== 'todos' && categoria.idModelo !== modeloSeleccionado) {
        return false;
      }
      
      // Filtrar por metodo de pago
      if (metodoPagoSeleccionado !== 'todos') {
        categoria.productos = categoria.productos.filter(producto => 
          producto.paidMethod.includes(metodoPagoSeleccionado)
        );
      }
        
      return categoria.productos.length > 0; // caterogiria con productos restantes o mayor a 0 
    });
    
    renderProductos(productosFiltrados);
  };
  
  // Agrega eventos a los selectores para que ejecuten el filtro al cambiar
  filtroModelo.addEventListener('change', handleFilterChange);
  filtroPago.addEventListener('change', handleFilterChange);
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
      // Obtiene los precios en USD y ARS del producto
      const precioUSD = producto.getPrecio('USD'); // Obtiene el precio en USD
      const precioARS = producto.getPrecio('ARS')
      const descuentoUSD = producto.getDescuento('USD'); // Obtiene el descuento en USD
      const descuentoARS = producto.getDescuento('ARS');
      
      // Crea el HTML para cada producto
      const productoHTML = `
        <div class="producto-card" data-id="${producto.getId()}">
          <div class="producto-imagen-container">
            <img src="..${producto.getImgSrc()}" alt="${producto.getDescripcion()}" class="producto-imagen" onerror="this.src='../../resources/imgs/placeholder.jpg'">
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
            
            <div class="producto-precios">
              <span class="precio-usd">USD $${precioUSD}</span> <!-- Precio en USD -->
              ${descuentoUSD ? `<span class="descuento">-${descuentoUSD}%</span>` : ''} <!-- Muestra el descuento si existe -->
              <br>
              <span class="precio-ars">ARS $${precioARS.toLocaleString('es-AR')}</span> <!-- Precio en pesos -->
              ${descuentoARS ? `<span class="descuento">-${descuentoARS}%</span>` : ''} <!-- Muestra el descuento si existe -->
            </div>
            
            <!-- Sistema de comprobacion stock -->
            <div class="producto-acciones">
              <span class="stock ${producto.getStock() > 0 ? 'en-stock' : 'agotado'}">
                ${producto.getStock() > 0 ? '🟢 En stock' : '🔴 Agotado'} <!-- Muestra si el producto esta en stock o agotado -->
              </span>
              <!-- Boton de compra y Envio de datos del objeto-->
              <button class="btn-comprar" data-id="${producto.getId()}" data-idmodelo="${producto.getidModelo()}">
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
  // Selecciona todos los botones de compra
  document.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Evita el comportamiento predeterminado del boton
      const productId = e.target.dataset.id; // Obtiene el ID del producto desde el atributo data-id
      const teeeeeest55555 = e.target.dataset.idmodelo; // Obtiene el ID del modelo desde el atributo data-idmodelo

      // Guarda el ID del producto seleccionado en el localStorage
      localStorage.setItem('selectedProductId', productId);
      localStorage.setItem('selectedTest55', teeeeeest55555); // Guarda el ID del modelo en el localStorage

      // Redirige al usuario a la pagina de compra
      window.location.href = '../../main/comprar/comprar.html';
    });
  });
}