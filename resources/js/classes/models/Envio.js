export class Envio {
    // Constructor Principal de espera 2 parametros
    constructor(metodoEnvio, costoBase) {
      this.metodoEnvio = metodoEnvio; // metodo de envio
      this.costoBase = costoBase; // Costo base
    }

    // Devuelve un valor dependiendo de la condicion
    calcularCosto() {
      if (this.metodoEnvio === 'envio-domicilio') {
        return this.costoBase * 0.8;
      } else {
        return this.costoBase * 0.2;
      }
    }

    // Un resumen
    resumen() {
      return {
        metodo: this.metodoEnvio,
        costo: this.calcularCosto(),
      };
    }
}