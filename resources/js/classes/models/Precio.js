export class Precio {
  // Contructor que espera 4 paramtros
  constructor({moneda, precio, descuento = 0, region}) {
    this.moneda    = moneda;
    this.precio     = precio;
    this.descuento = descuento;
    this.region    = region;
  }

  // Retorna por la cantidad comprada de stock
  precioSubtotal(cantidad) {
    return this.precio * cantidad;
  }

  // Simple recargo
  calcularRecargo(cantidad, recargo) {
    return this.precioSubtotal(cantidad) * (recargo / 100);
  }

  precioTotal(cantidad) {
    return this.precioSubtotal(cantidad) + this.calcularRecargo(cantidad, this.descuento);
  }

  getMonto() {
    return this.precio;
  }

  getDescuento() {
    return this.descuento;
  }

  getRegion() {
    return this.region;
  }

  getMoneda() {
    return this.moneda;
  }
  
}
