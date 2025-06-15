// js/scripts/finalizarCompra.js
import { ProductService } from '../classes/services/ProductService.js';
import { rendererForm } from '../classes/ui/rendererForm.js';
import { Pago } from '../classes/models/Pago.js';
import { Precio } from '../classes/models/Precio.js';
import { Envio } from '../classes/models/Envio.js';
import { Compra } from '../classes/models/Compra.js';

document.addEventListener('DOMContentLoaded', async () => {
  const categorias = await ProductService.loadProducts();
  const rndrForm = new rendererForm(categorias, 'finalizar-compra');
  rndrForm.initRenderForm();

  const selectPago = document.getElementById('pagar-en');
  const radiosPago = Array.from(document.getElementsByName('paid'));
  const extraPago3ro = document.getElementById('extra-pago-tercero');
  const cantidadInput = document.getElementById('cantidad');
  const metodoEnvioEl = document.getElementById('metodo-envio');
  const precioTotalEl = document.getElementById('precio-final-txt');
  const textoRecargo = document.getElementById('text-recargo');

  const lectura = {
    canalPago: () => selectPago.value,
    tipoTarjeta: () => radiosPago.find(r => r.checked)?.value ?? '',
    cantidad: () => parseInt(cantidadInput.value, 10) || 1,
    metodoEnvio: () => metodoEnvioEl.value
  };

  function handlePago() {
    const pagoTemp = new Pago(lectura.canalPago(), lectura.tipoTarjeta());
    const mostrar = pagoTemp.debeMostrarTercero();
    extraPago3ro.style.display = mostrar ? 'block' : 'none';
  }

  function handlePrecio() {
    const montoUnitario = rndrForm.productPrecio[0].getMonto();
    const cantidad = lectura.cantidad();
    const recargoPct = 2;

    const modeloPrecio = new Precio({
      moneda: 'ARS',
      precio: montoUnitario,
      descuento: recargoPct,
      region: 'ar-AR'
    });

    const subtotal = modeloPrecio.precioSubtotal(cantidad);
    const recargoVal = modeloPrecio.calcularRecargo(cantidad, recargoPct);
    const totalSinEnvio = modeloPrecio.precioTotal(cantidad);
    
    textoRecargo.style.display = recargoVal > 0 ? 'block' : 'none';

    const envioTemp = new Envio(precioTotalEl.value, 3);
    const costoEnvio = envioTemp.calcularCosto();
    const test = modeloPrecio.calcularRecargo(cantidad, costoEnvio)

    precioTotalEl.textContent = `
      $${(totalSinEnvio + costoEnvio + recargoVal).toFixed(2)} (Subtotal: $${subtotal.toFixed(2)}${
      recargoVal > 0 ? ` + Recargo: $${recargoVal.toFixed(2)}` : ''
    } + Envío: $${test.toFixed(2)})`;
  }

  selectPago.addEventListener('change', handlePago);
  radiosPago.forEach(r => r.addEventListener('change', handlePago));
  cantidadInput.addEventListener('change', handlePrecio);
  metodoEnvioEl.addEventListener('change', handlePrecio);

  handlePago();
  handlePrecio();

  document.getElementById('compra-container').addEventListener('submit', e => {
    e.preventDefault();

    const pagoFinal = new Pago(lectura.canalPago(), lectura.tipoTarjeta());
    const cantidad = lectura.cantidad();
    const precioUnitario = rndrForm.productPrecio[0].getMonto();
    const precioModel = new Precio({ moneda: 'ARS', precio: precioUnitario, descuento: 2, region: 'ar-AR' });
    const totalSinEnvio = precioModel.precioTotal(cantidad);

    const envioFinal = new Envio(lectura.metodoEnvio(), 500);
    const compra = new Compra(rndrForm.selectedPrdct, totalSinEnvio, pagoFinal, envioFinal);

    try {
      const recibo = compra.realizarCompra();
      console.log(recibo)
      alert("Compra Finalizada");
      window.location.href = "../store/store.html";
    } catch (err) {
      console.error(err);
      alert(`Error al procesar la compra: ${err.message}`);
    }
  });
});
