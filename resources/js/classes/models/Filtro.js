export class Filtro {
  // Constructor de un objeto
  constructor({filtroModelo, filtroPago, filtroCurrency, filtroColor, btnFiltrar = null, renderer}) {
    this._filtroModelo = filtroModelo;
    this._filtroPago = filtroPago;
    this._filtroCurrency = filtroCurrency;
    this._filtroColor = filtroColor;
    this._btnFiltrar = btnFiltrar;
    this._renderer = renderer;
  }

  initialize(data) {
    // Inicializar primero
    this._addDefaultOptions();
    this._loadOptionsModel(data);
    this._loadOptionsPago(data);
    this._loadOptionsCurrency(data);
    this._loadOptionsColor(data);

    // Funcion arrow para actualizar y aplicar el filtro
    const changeHandler = () => this._applyFilters(data);

    // Si exite el boton de filtro
    if (this._btnFiltrar) {
      this._btnFiltrar.addEventListener('click', changeHandler); // Si se recibe el evento del boton "Click" llama a la Fun arrow
    } else {
      // En caso de que no exista el boton, y se detecte algun cambio de valor en esos elemento recorridos por un forEach actualiza los Productos en pantalla
      [
        this._filtroModelo,
        this._filtroPago,
        this._filtroCurrency,
        this._filtroColor,
      ].forEach(el => el.addEventListener('change', changeHandler));
    }

    // Filtro Principal
    this._applyFilters(data);
  }

  _addDefaultOptions() {
    // Pone a todos los filtros recorridos por un forEach en la opcion de "todos"
    [
      this._filtroModelo,
      this._filtroPago,
      this._filtroCurrency,
      this._filtroColor,
    ].forEach(select => {
      if (!select.querySelector('option[value="todos"]')) {
        select.insertAdjacentHTML('afterbegin', '<option value="todos">Todos</option>');
      }
    });
  }

  _loadOptionsModel(data) {
    if (this._filtroModelo.length > 1) return;
    const modelos = [...new Set(data.map(cat => cat.idModelo))];
    modelos.forEach(m => {
      this._filtroModelo.insertAdjacentHTML(
        'beforeend',
        `<option value="${m}">${m}</option>`
      );
    });
  }

  _loadOptionsPago(data) {
    if (this._filtroPago.length > 1) return;
    const pagos = new Set();
    data.forEach(cat => cat.productos.forEach(p => p.paidMethod.forEach(m => pagos.add(m))));
    pagos.forEach(m => {
      this._filtroPago.insertAdjacentHTML(
        'beforeend',
        `<option value="${m}">${m}</option>`
      );
    });
  }

  _loadOptionsCurrency(data) {
    if (this._filtroCurrency.length > 1) return;
    const monedas = new Set();
    data.forEach(cat => cat.productos.forEach(p => p.precio.forEach(pr => monedas.add(pr.moneda))));
    monedas.forEach(moneda => {
      this._filtroCurrency.insertAdjacentHTML(
        'beforeend',
        `<option value="${moneda}">${moneda}</option>`
      );
    });
  }

  _loadOptionsColor(data) {
    if (this._filtroColor.length > 1) return;
    const colores = new Set();
    data.forEach(cat =>
      cat.productos.forEach(p => p.colores.forEach(c => colores.add(c.color || c)))
    );
    colores.forEach(color => {
      this._filtroColor.insertAdjacentHTML(
        'beforeend',
        `<option value="${color}">${color}</option>`
      );
    });
  }

  _applyFilters(data) {
    const result = data
      .map(cat => this._filterCategory(cat))
      .filter(cat => cat && cat.productos.length);
    this._renderer.rendererMain(result);
  }

  _filterCategory(cat) {
    const modelo = this._filtroModelo.value;
    const pago = this._filtroPago.value;
    const currency = this._filtroCurrency.value;
    const color = this._filtroColor.value;

    if (modelo !== 'todos' && cat.idModelo !== modelo) return null;
    let prods = [...cat.productos];

    if (pago !== 'todos') {
      prods = prods.filter(p => 
        Array.isArray(p.getPaidMethod()) &&
        p.getPaidMethod().includes(pago)
      );
    }

    if (currency !== 'todos') {
      prods = prods.filter(p =>
        typeof p.hasCurrency === 'function' &&
        p.hasCurrency(currency)
      );
    }

    if (color !== 'todos') {
  const buscado = color.toLowerCase().trim();

  prods = prods.filter(p => {
    const colores = typeof p.getColores === 'function' ? p.getColores() : [];
    if (!Array.isArray(colores)) return false;

    return colores.some(c => {
      if (typeof c === 'object' && c !== null && 'color' in c) {
        return c.color.toLowerCase().trim() === buscado;
      }
      return false;
    });
  });
}


    return prods.length ? { ...cat, productos: prods } : null;
  }

}