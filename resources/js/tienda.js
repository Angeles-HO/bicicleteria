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
  const filtroModelo = document.getElementById('filtro-modelo');
  const filtroPago = document.getElementById('method-paid-container');
  const filtroCurrency = document.getElementById('filtro-currency');
  const filtroColor = document.getElementById('filtro-color');
  const isPressedFilterButton = document.getElementById('btn-filtrar')
  // Instancia la clase renderFiltros y delega la logica de filtrado y renderizado
  const filtrosManager = new renderFiltros(
    filtroModelo,
    filtroPago,
    filtroCurrency,
    filtroColor,
    isPressedFilterButton,
    renderer // pasar el renderer para que la clase pueda renderizar
  );

  filtrosManager.inicializate(data);
}