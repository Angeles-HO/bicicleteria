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
  
    getId(){
        return this._id;
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

    getIsCAE(p) {
        return this._precio.map(p => p.moneda)
    }

    getPrecio(moneda) {
        return this._precio.find(p => p.moneda === moneda)?.precio ?? '';
    }

    getDescuento(moneda) {
        return this._precio.find(p => p.moneda === moneda)?.descuento ?? '';
    }

    getRegion(moneda) {
        return this._precio.find(p => p.moneda === moneda)?.region ?? '';
    }

    getCurrency(region) {
        return this._precio.find(p => p.region === region)?.currency ?? '';
    }

    getImgSrc() {
        return this._imagen;
    }

    getDescripcion() {
        return this._descripcion;
    }

    getIdModelo() {
        return this._idModelo;
    }

    getModelo() {
        return this._modelo;
    }

    getCalcularDescuento(moneda) {
        // mejora de busqueda y devolucion si se encuentra el elemento descuento
        const ifDiscount = this.getDescuento(moneda);
        const ifPrecio = this.getPrecio(moneda);
        if (!ifPrecio || !ifDiscount) {
            return 0;
        }
        const total = ifPrecio * (1 - ifDiscount/100);
        const result = Math.max(total, 0);
        return Math.round(result * 100) / 100;
    }
}