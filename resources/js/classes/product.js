export class Product {
    constructor(id, marca, nombre, colores, precio, etiquetas, paidMethod, stock, imagen, descripcion, idModelo, modelo) {
      this._id = id;
      this._marca = marca;
      this._nombre = nombre;
      this._colores = colores;
      this._precio = precio;
      this._etiquetas = etiquetas;
      this._paidMethod = paidMethod;
      this._stock = stock;
      this._imagen = imagen;
      this._descripcion = descripcion;
      this._idModelo = idModelo;
      this._modelo = modelo;
    }

    get id() { return this._id; }
    get marca() { return this._marca; }
    get nombre() { return this._nombre; }
    get colores() { return this._colores; }
    get precio() { return this._precio; }
    get tags() { return this._etiquetas; }
    get paidMethod() { return this._paidMethod; }
    get stock() { return this._stock; }
    get imagen() { return this._imagen; }
    get descripcion() { return this._descripcion}
  
    thisColor(color) {
      return this._colores.find(c => c.color === color) || error("Color no encontrado o no disponible");
    }

    getId(){
        return this.id;
    }

    getMarca() {
        return this._marca;
    }

    getNombre() {
        return this._nombre;
    }

    getColores() {
        return this._colores; 
    }

    getPaidMethod() {
        return this._paidMethod;
    }
 
    getStock() {
        return this._stock;
    }

    getPrecio(moneda) {
        return this._precio.find(p => p.moneda === moneda)?.precio;
    }

    getDescuento(moneda) {
        return this._precio.find(p => p.moneda === moneda)?.descuento || 0;
    }

    getImgSrc() {
        return this._imagen;
    }

    getDescripcion() {
        return this._descripcion;
    }

    getidModelo() {
        return this._idModelo;
    }

    getModelo() {
        return this._modelo;
    }

}