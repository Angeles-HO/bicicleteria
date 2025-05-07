export class Product {
    constructor(id, marca, nombre, precio, stock) {
      this._id = id;
      this._marca = marca;
      this._nombre = nombre;
      this._precio = precio;
      this._stock = stock;
    }
  
    get id() { return this._id; }
    get stock() { return this._stock; }
  
    set stock(value) {
      if (value >= 0) this._stock = value;
      else console.error("Stock no puede ser negativo");
    }

}