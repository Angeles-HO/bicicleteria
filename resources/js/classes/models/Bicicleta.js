export class Bicicleta {
    // Constructor principal que espera los datos de la bicicleta seleccionada
    constructor({id, marca, nombre, colores, precio, etiquetas, paidMethod, stock, imagen, descripcion, idModelo, modelo}) {
        this._id = id;
        this._marca = marca;
        this._nombre = nombre;
        this._colores = colores || [];
        this._precio = precio || [];
        this._etiquetas = etiquetas || [];
        this._paidMethod = paidMethod || [];
        this._stock = stock ?? 0;
        this._imagen = imagen || '';
        this._descripcion = descripcion || '';
        this._idModelo = idModelo || '';
        this._modelo = modelo || '';
    }

    // Devuelve el id de la bicicleta
    getId() {
        return this._id;
    }

    // Devuelve la marca
    getMarca() {
        return this._marca;
    }

    // Devuelve el nombre
    getNombre() {
        return this._nombre;
    }

    // Devuelve el array de colores
    getColores() {
        return this._colores;
    }

    // Devuelve el stock disponible
    getStock() {
        return this._stock;
    }

    getRegion(moneda) {
        return this._precio.find(p => p.moneda === moneda)?.region || "es-ES";
    }

    getCurrency(region) {
        return this._precio.find(p => p.region === region)?.moneda || "EUR";
    }

    getIsCAE() {
        return this._precio.map(p => p.moneda);
    }

    getIsCAE2(currency) {
        return Array.isArray(this._precio) && this._precio.some(p => p.moneda === currency);
    }

    // Devuelve true si existe la moneda indicada
    hasCurrency(currency) {
        return Array.isArray(this._precio) && this._precio.some(p => p.moneda === currency);
    }

    // Devuelve el descuento para la moneda indicada, o null si no existe
    getPrecio(moneda) {
        const obj = this._precio.find(p => p.moneda === moneda);
        return obj?.precio ?? "";
    }

    // Devuelve los metodos de pago disponibles
    getPaidMethod() {
        return this._paidMethod;
    }

    getPaidMethodStr() {
        return this._paidMethod.join(', ');
    }

    getDescuento(moneda) {
        const obj = this._precio.find(p => p.moneda === moneda);
        return obj?.descuento ?? "";
    }

    // Devuelve la ruta de la imagen
    getImgSrc() {
        return this._imagen;
    }

    // Devuelve la descripcion
    getDescripcion() {
        return this._descripcion;
    }

    // Devuelve el id del modelo
    getIdModelo() {
        return this._idModelo;
    }

    // Devuelve el nombre del modelo
    getModelo() {
        return this._modelo;
    }

    getPrecioConDescuento(moneda) {
        const obj = this._precio.find(p => p.moneda === moneda);
        if (!obj) return 0;
        const descuento = obj.descuento || 0;
        return obj.precio - (obj.precio * descuento / 100);
    }
}