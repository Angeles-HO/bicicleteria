export class DOMhandler {
    constructor(selectPago, pago3ro, radios, precioTotal, metodoEnvio, txtRecargo, precio, sumXcantidad, efectivo3ros, tarjeta3ros) {
        this.selectPago = selectPago,
        this.pago3ro = pago3ro,
        this.radios = radios,
        this.precioTotal = precioTotal,
        this.metodoEnvio = metodoEnvio,
        this.productPrecio = [precio],
        this.sumXcantidad = sumXcantidad,
        this.efectivo3ros = efectivo3ros,
        this.tarjeta3ros = tarjeta3ros,
        this.txtRecargo = txtRecargo
    }

    updatePrecioTotal(total, precio, envio) {
        const amountBuyProd = this.sumXcantidad.value;
        this.precioTotal.textContent = `$${total} (Original: $${precio/amountBuyProd} ${amountBuyProd > 1 ? `[x${amountBuyProd}]` : ''} ${envio > 0 ? `- Recargo: $${envio}` : ''})`;
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

        const testing2 = document.get
    }

    rechargeSystem() {
        this.calcularPrecio();
    }

    calcularPrecio() {
        const precio = this.getActualAmoutPrecio();
        const calculoRecargo = (precio / 100) * 2; // Ejemplo de recargo del [x]%
        const envio = this.metodoEnvio.value === 'retiro-local' ? 0 : calculoRecargo; // Ejemplo de costo de envio
        const total = precio + envio;
        this.toggleRecargoDisplay(this.metodoEnvio.value !== 'retiro-local');
        this.updatePrecioTotal(total, precio, envio);
    }

    getActualAmoutPrecio() {
        return this.productPrecio[0] * this.sumXcantidad.value;
    }
}
