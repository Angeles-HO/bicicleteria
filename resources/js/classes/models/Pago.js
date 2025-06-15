export class Pago {
  // Constructor principal de pago que espera 2 parametros
  constructor(canalPago, tipoTarjeta) {
    this.canalPago  = canalPago;
    this.tipoTarjeta = tipoTarjeta;
  }

  // Se espera que devuelva un bool si se cumple las condiciones
  debeMostrarTercero() {
    return (
      this.canalPago === 'tercero' &&
      this.tipoTarjeta.toLowerCase().includes('tarjeta')
    );
  }

  // Devuelve el precio
  getThisPago() {
    return this.canalPago;
  }

  // Devuelve un objeto con detalles
  realizarPago(value) {
    if (!value) return console.error("Sin valor obtenido");
    
    return {
      exito: "Compra realziada con exito.",
      message: "Valor obtenido pero algun fallo",
      detalles: `Valor total: [${value}]`
    }
  }

  // Retorna en que lugar va a apagar
  getThisTipoTarjeta() {
    return this.tipoTarjeta;
  }
}
