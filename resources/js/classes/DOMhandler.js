export class DOMhandler {
    constructor(selectPago, pago3ro, radios) {
        this.selectPago = selectPago,
        this.pago3ro = pago3ro,
        this.radios = radios,
        this.precioTotal = document.getElementById('precio-total'),
        this.metodoEnvio = document.getElementById('metodo-envio'),
        this.txtRecargo = document.getElementById('text-recargo')
    }

    updatePrecioTotal(total, precio, envio) {
        this.precioTotal.textContent = `$${total} (Original: $${precio} - Recargo: $${envio})`;
    }

    toggleRecargoDisplay(isVisible) {
        this.txtRecargo.style.display = isVisible ? 'inline' : 'none';
    }

    checkShowExtra() {
        let pagoSeleccionado = 'efectivo';
        this.radios.forEach(r => { if(r.checked) pagoSeleccionado = r.value; });
        if(this.selectPago.value === 'tercero' && pagoSeleccionado.toLowerCase().includes('tarjeta')) {
            this.pago3ro.style.display = 'block';
        } else {
            this.pago3ro.style.display = 'none';
        }
    }
}
