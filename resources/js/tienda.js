// Importar la clase ProductService desde el archivo productService.js
import { ProductService } from '../js/classes/ProductService.js';
import { Storage } from '../js/classes/storage.js';
import { renderFiltros } from '../js/classes/renderFiltros.js';
import { renderProd } from '../js/classes/rendererProducts.js'

if (!Storage.get("sessionUser")) {
  window.location.href = "../login/login.html";
}

const renderer = new renderProd();
// Esperar a que el DOM este completamente cargado antes de ejecutar el codigo
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Intenta cargar los datos de los productos desde un archivo JSON con los datos de las bicicletas
    // Se utiliza fetch para obtener los datos de un archivo JSON
    // El archivo JSON contiene un array de objetos, cada uno representando una categoria de productos
    const CandP = await ProductService.loadProducts(); // Carga los productos utilizando la clase ProductService
    
    // Renderiza los productos en la pagina
    renderer.rendererMain(CandP);

    // Configura los filtros para filtrar los productos
    setupFilters(CandP);

  } catch (error) {
    // Si ocurre un error, lo muestra en la consola y en la interfaz
    console.error('Error:', error);
    return renderer.PrdNotLoaded();
  }
});

// Configura los filtros para filtrar los productos segun el modelo y el metodo de pago
function setupFilters(data) {
  // Obtiene los elementos del DOM para los filtros de modelo y metodo de pago
  const filtroModelo = document.getElementById('filtro-modelo'); // Selector para filtrar por modelo
  const filtroPago = document.getElementById('method-paid-container'); // Selector para filtrar por metodo de pago
  const filtroCurrency = document.getElementById('filtro-currency');
  // Funcion que maneja los cambios en los filtros
  const handleFilterChange = () => {
    // Obtiene los valores seleccionados en los filtros
    const modeloSeleccionado = filtroModelo.value; // Valor seleccionado en el filtro de modelo
    const metodoPagoSeleccionado = filtroPago.value; // Valor seleccionado en el filtro de metodo de pago
    const currencyType = filtroCurrency.value;

    // Filtra las categorias y sus productos segun los filtros seleccionados
    const productosFiltrados = data.map(categoria => {
      // Filtra los productos de la categoria por metodo de pago si se selecciono uno especifico
      let productos = categoria.productos;
      
      if (metodoPagoSeleccionado !== 'todos') {
        productos = productos.filter(producto => 
          producto.paidMethod.includes(metodoPagoSeleccionado) // Incluye solo los productos que soportan el metodo de pago seleccionado
        );
      }

      if (currencyType !== 'todos') {
        productos = productos.filter(producto =>
          producto.getIsCAE(producto).includes(currencyType)
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
    renderer.rendererMain(productosFiltrados);
  };
  
  const filtrosManager = new renderFiltros(
    document.getElementById('filtro-modelo'), 
    document.getElementById('method-paid-container'), 
    document.getElementById('filtro-currency'), 
    handleFilterChange
  );

  filtrosManager.inicializate(data)
}