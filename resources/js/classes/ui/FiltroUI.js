// Servicio de UI para manejar los filtros de productos
import { Filtro } from '../models/Filtro.js';

// Clase para la interfaz de filtros
export class FiltroUI {
  // Recibe los selectores de los filtros, el boton de filtrar (opcional) y el renderer
  constructor({ filtroModelo, filtroPago, filtroCurrency, filtroColor, btnFiltrar = null, renderer }) {
    this.selectores = {
      modelo: filtroModelo,
      pago: filtroPago,
      currency: filtroCurrency,
      color: filtroColor,
    };
    this.btnFiltrar = btnFiltrar;
    this.renderer = renderer;
  }

  // Inicializa los filtros y listeners
  initialize(data) {
    this._agregarOpcionTodos();
    this._cargarOpciones(data);

    // Handler para aplicar los filtros y renderizar
    const handler = () => {
      const filtros = {
        modelo: this.selectores.modelo.value,
        pago: this.selectores.pago.value,
        currency: this.selectores.currency.value,
        color: this.selectores.color.value,
      };
      const filtrados = Filtro.aplicar(data, filtros);
      this.renderer.rendererMain(filtrados);
    };

    // Si hay boton de filtrar, usa click, si no, usa change en cada filtro
    if (this.btnFiltrar) {
      this.btnFiltrar.addEventListener('click', handler);
    } else {
      Object.values(this.selectores).forEach(el => el.addEventListener('change', handler));
    }

    handler(); // Aplica los filtros al inicio
  }

  // Agrega la opcion 'todos' a cada filtro si no existe
  _agregarOpcionTodos() {
    Object.values(this.selectores).forEach(select => {
      if (!select.querySelector('option[value="todos"]')) {
        select.insertAdjacentHTML('afterbegin', '<option value="todos">Todos</option>');
      }
    });
  }

  // Carga todas las opciones de los filtros
  _cargarOpciones(data) {
    this._cargarModelos(data);
    this._cargarPagos(data);
    this._cargarMonedas(data);
    this._cargarColores(data);
  }

  // Carga los modelos unicos
  _cargarModelos(data) {
    if (this.selectores.modelo.length > 1) return;
    const modelos = [...new Set(data.map(cat => cat.idModelo))];
    modelos.forEach(m =>
      this.selectores.modelo.insertAdjacentHTML('beforeend', `<option value="${m}">${m}</option>`)
    );
  }

  // Carga los metodos de pago unicos
  _cargarPagos(data) {
    if (this.selectores.pago.length > 1) return;
    const pagos = new Set();
    data.forEach(cat => cat.productos.forEach(p => p.paidMethod.forEach(m => pagos.add(m))));
    pagos.forEach(m =>
      this.selectores.pago.insertAdjacentHTML('beforeend', `<option value="${m}">${m}</option>`)
    );
  }

  // Carga las monedas unicas
  _cargarMonedas(data) {
    if (this.selectores.currency.length > 1) return;
    const monedas = new Set();
    data.forEach(cat => cat.productos.forEach(p => p.precio.forEach(pr => monedas.add(pr.moneda))));
    monedas.forEach(moneda =>
      this.selectores.currency.insertAdjacentHTML('beforeend', `<option value="${moneda}">${moneda}</option>`)
    );
  }

  // Carga los colores unicos
  _cargarColores(data) {
    if (this.selectores.color.length > 1) return;
    const colores = new Set();
    data.forEach(cat =>
      cat.productos.forEach(p => p.colores.forEach(c => colores.add(c.color || c)))
    );
    colores.forEach(color =>
      this.selectores.color.insertAdjacentHTML('beforeend', `<option value="${color}">${color}</option>`)
    );
  }
}