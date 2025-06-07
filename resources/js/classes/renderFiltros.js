export class renderFiltros {
  constructor(filtroModelo, filtroPago, filtroCurrency, renderer) {
    this._filtroModelo = filtroModelo,
    this._filtroPago = filtroPago,
    this._filtroCurrency = filtroCurrency,
    this.renderer = renderer
  }

  inicializate(data) {
    this.loadOptionsModel(data);
    this.loadOptionsPago(data);
    this.loadOptionsCurrency(data);
    this._filtroModelo.addEventListener('change', () => this.testingMethod(data));
    this._filtroPago.addEventListener('change', () => this.testingMethod(data));
    this._filtroCurrency.addEventListener('change', () => this.testingMethod(data));
    this.testingMethod(data);
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

  testingMethod(data) {
    // Obtiene los valores seleccionados en los filtros
    const modeloSeleccionado = this._filtroModelo.value; // Valor seleccionado en el filtro de modelo
    const metodoPagoSeleccionado = this._filtroPago.value; // Valor seleccionado en el filtro de metodo de pago
    const currencyType = this._filtroCurrency.value;

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
          typeof producto.getIsCAE === 'function' && producto.getIsCAE(producto).includes(currencyType)
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
    this.renderer.rendererMain(productosFiltrados);
  }
}