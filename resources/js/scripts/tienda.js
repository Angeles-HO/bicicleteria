// Importar la clase ProductService desde el archivo productService.js
import { ProductService } from '../classes/services/ProductService.js';
import { Storage } from '../classes/services/storage.js';
import { Filtro } from '../classes/models/Filtro.js';
import { renderProd } from '../classes/ui/rendererProducts.js';

document.addEventListener('DOMContentLoaded', async () => {
  if (!Storage.get('sessionUser')) {
    location.href = '../login/login.html';
    return;
  }

  try {
    const data = await ProductService.loadProducts();
    const renderer = new renderProd();
    renderer.rendererMain(data);

    const filtros = new Filtro({
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
