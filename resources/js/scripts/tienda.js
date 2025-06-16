// Section classes and services
import { FiltroUI } from '../classes/ui/FiltroUI.js';
import { renderProd } from '../classes/ui/rendererProducts.js';
import { ProductService } from '../classes/services/ProductService.js';
import { Storage } from '../classes/services/storage.js';

// Logica frincipal
document.addEventListener('DOMContentLoaded', async () => {
  // Comprobacion de login
  if (!Storage.get('sessionUser')) {
    location.href = '../login/login.html';
    return;
  }

  // try catch para cargar y filtrar prods + logica
  try {
    const data = await ProductService.loadProducts();
    const renderer = new renderProd();
    renderer.rendererMain(data);

    const filtros = new FiltroUI({
      filtroModelo: document.getElementById('filtro-modelo'),
      filtroPago: document.getElementById('method-paid-container'),
      filtroCurrency: document.getElementById('filtro-currency'),
      filtroColor: document.getElementById('filtro-color'),
      btnFiltrar: document.getElementById('btn-filtrar'),
      renderer,
    });

    filtros.initialize(data);
  } catch (err) {
    console.error(err);
    new renderProd().PrdNotLoaded();
  }
});

