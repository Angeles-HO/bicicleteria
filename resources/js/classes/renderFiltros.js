export class renderFiltros {
  constructor(filtroModelo, filtroPago, filtroCurrency, filtroColor, renderer) {
    this._filtroModelo = filtroModelo,
    this._filtroPago = filtroPago,
    this._filtroCurrency = filtroCurrency,
    this._filtroColor = filtroColor,
    this.renderer = renderer
  }

  inicializate(data) {
    this.loadOptionsModel(data);
    this.loadOptionsPago(data);
    this.loadOptionsClrs(data);
    this.loadOptionsCurrency(data);
    this._filtroModelo.addEventListener('change', () => this.initMethodFilters(data));
    this._filtroPago.addEventListener('change', () => this.initMethodFilters(data));
    this._filtroColor.addEventListener('change', () => this.initMethodFilters(data));
    this._filtroCurrency.addEventListener('change', () => this.initMethodFilters(data));
    this.initMethodFilters(data);
  }

  loadOptionsModel(data) {
    if (this._filtroModelo.innerHTML === '') {
      // Extrae los modelos unicos de las categorias en los datos
      // Crear un array con valores unicos de idModelo
      const modelosUnicos = [...new Set(data.map(cat => cat.idModelo))];
      modelosUnicos.forEach(modelo => {
        // Agrega cada modelo como una opcion en el filtro de modelo
       this._filtroModelo.innerHTML += `<option value="${modelo}">${modelo}</option>`;
      });
    }
  }

  loadOptionsClrs(data) {
    if (this._filtroColor.innerHTML === '') {
      const coloresUnicos = new Set(); // Crea un conjunto para almacenar colores unicos
      data.forEach(cat => {
        // Itera sobre cada categoria y sus productos
        cat.productos.forEach(prod => {
          // Agrega cada color del producto al conjunto
          prod.colores.forEach(color => coloresUnicos.add(color));
        });
      });
      coloresUnicos.forEach(color => {
        // Agrega cada color como una opcion en el filtro de color
        this._filtroColor.innerHTML += `<option value="${color}">${color}</option>`;
      });
    }
  }

  loadOptionsPago(data) {
    // Verifica si el filtro de metodo de pago ya tiene opciones cargadas
    if (this._filtroPago.innerHTML === '') {
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
        this._filtroPago.innerHTML += `<option value="${metodo}">${metodo}</option>`;
      });
    }
  }

  // Configura los filtros para filtrar los productos segun el modelo y el metodo de pago
  loadOptionsCurrency(data) {
    if (this._filtroCurrency.innerHTML === '') {
      const cCrrncy = new Set();
      data.forEach(cat => {
          cat.productos.forEach(prod => {
              prod.precio.forEach(precio => {
                  cCrrncy.add(precio.moneda)
              });
          });
      });
      cCrrncy.forEach(moneda => {
          this._filtroCurrency.innerHTML += `<option value="${moneda}">${moneda}</option>`
      })
    }
  }

  initMethodFilters(data) {
    const filteredProducts = this.filterProds(data);
    this.renderer.rendererMain(filteredProducts);
  }

  filterProds(data) {
    return data
    .map(categoria => this.filterCategoryProducts(categoria))
    .filter(categoria => categoria !== null && categoria.productos.length > 0); // no muestra categorias cuyo productos filtrados sean sean <= a 0.
  }

  filterCategoryProducts(categoria) {
    const { _filtroModelo, _filtroPago, _filtroColor, _filtroCurrency } = this;
    const modeloSeleccionado = _filtroModelo.value;
    const metodoPagoSeleccionado = _filtroPago.value;
    const currencyType = _filtroCurrency.value;
    const colorSeleccionado = _filtroColor.value;

    // Filtrar por modelo primero.
    if (modeloSeleccionado !== 'todos' && categoria.idModelo !== modeloSeleccionado) {
      return null;
    }

    let productos = [...categoria.productos];

    // Aplicar filtros en cascada
    productos = this.filterByPaymentMethod(productos, metodoPagoSeleccionado);
    productos = this.filterByCurrencyType(productos, currencyType);
    productos = this.filterByColor(productos, colorSeleccionado);

    return productos.length > 0
      ? { ...categoria, productos }
      : null;
  }

  filterByColor(productos, colorSeleccionado) {
    if (colorSeleccionado === 'todos' || !productos || !productos.length) {
      return productos;
    }

    const colorBuscado = colorSeleccionado.toLowerCase().trim();

    return productos.filter(producto => {
      // Verificar si el producto tiene colores
      if (!producto.colores || !producto.colores.length) return false;

      // Buscar si alguno de los colores coincide
      return producto.colores.some(colorObj => {
        // Verificar que el objeto color tenga la propiedad 'color'
        if (!colorObj || !colorObj.color) return false;

        // Comparar colores normalizados
        return colorObj.color.toLowerCase().trim() === colorBuscado;
      });
    })
  }

  filterByPaymentMethod(productos, metodoPagoSeleccionado) {
    return metodoPagoSeleccionado !== 'todos'
      ? productos.filter(p => p.paidMethod.includes(metodoPagoSeleccionado))
      : productos;
  }

  filterByCurrencyType(productos, currencyType) {
    return currencyType !== 'todos'
      ? productos.filter(p => 
          typeof p.getIsCAE === 'function' && 
          p.getIsCAE(p).includes(currencyType))
      : productos;
  }
}