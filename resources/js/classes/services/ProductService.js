// js/classes/services/ProductService.js
import { Bicicleta } from "../models/Bicicleta.js";
import { Precio }    from "../models/Precio.js";

export class ProductService {
  static cache = null;

  static async loadProducts() {
    if (this.cache) return this.cache;

    const sources = {
      api: "/api/productos",
      local: "../../resources/data/bicicletas.json"
    };

    try {
      const data = await this._tryLoad(sources.api);
      return this._procesar(data);
    } catch {
      console.warn("[ProductService] API falló, cargando JSON local");
      const data = await this._tryLoad(sources.local);
      return this._procesar(data);
    }
  }

  static async _tryLoad(url) {
    const response = await Promise.race([
      fetch(url),
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error(`Timeout ${url}`)), 5000)
      )
    ]);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  static _procesar(data) {
    // data = [ { idModelo, modelo, productos: [ { … } ] }, … ]
    this.cache = data.map(({ idModelo, modelo, productos }) => ({
      idModelo,
      modelo,
      productos: productos.map(p => {
      // Asegúrate que `p.precio` es un array y crea instancias de Precio para cada moneda
      const preciosPorMoneda = (p.precio || []).map(item => new Precio({
        moneda: item.moneda,
        precio: item.precio,
        descuento: item.descuento ?? 0,
        region: item.region
      }));
    
      return new Bicicleta({
        id:         p.id,
        marca:      p.marca,
        nombre:     p.nombre,
        colores:    p.colores,
        precio:     preciosPorMoneda,       // ahora es un array de Precio
        etiquetas:  p.etiquetas,
        paidMethod: p.paidMethod,
        stock:      p.stock,
        imagen:     p.imagen,
        descripcion:p.descripcion,
        idModelo,
        modelo
      });
    })
    }));

    return this.cache;
  }
}
