export class Compra {
    // Constructor que recibe 4 parametros para devolver un recibo
    constructor(bicicleta, total, pagoTotal, envio) {
      this.bicicleta = bicicleta;
      this.total = total;
      this.pagoTotal = pagoTotal;
      this.envio = envio; 
      this.fecha = new Date(); // Para la fecha de compra
    }

    // Metodo principal para realizar compra
    realizarCompra() {
        // Simple comprobacion
        if (typeof this.pagoTotal.realizarPago !== 'function') {
          throw new Error('El objeto Pago no tiene metodo realizarPago()');
        }

        // Pasa valor total y devuelve un objeto con datos varios
        const resultadoPago = this.pagoTotal.realizarPago(this.total)

        // Si no se recibe el valor de exito dentro del objeto de resultadoPago ddevuelve un error
        if (!resultadoPago?.exito) {
          throw new Error(`Pago fallido: ${resultadoPago?.message || 'Sin mensaje'}`);
        }

        // Vars
        const costoEnvio = this.envio.calcularCosto();
        const montoFinal = this.total + costoEnvio;

        // Objeto recibo
        const recibo = {
          fecha: this.fecha.toISOString(),
          producto: this.bicicleta.nombre || this.bicicleta.idModelo || 'Producto',
          subtotal: this.total,
          envio: this.envio.resumen(),
          total: montoFinal,
          pago: resultadoPago.detalles || {} ,
        }

        return recibo;
    }
}