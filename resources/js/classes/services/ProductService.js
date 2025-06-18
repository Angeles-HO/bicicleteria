// ProductService: Servicio de carga y procesamiento de productos de bicicleta
import { Bicicleta } from "../models/Bicicleta.js";
import { Precio }    from "../models/Precio.js";

export class ProductService {
  // Utilizar cacha para evitar cargas repetidas
  static cache = null;

  // Carga productos desde API o JSON local devuelve los datos procesados
  static async loadProducts() {
    if (this.cache) return this.cache;

    const sources = {
      api: "/api/productos", // Api
      local: "../../resources/data/bicicletas.json"
    };

    // Intenta cargar desde la API pero va al JSON local si la API falla
    try {
      const data = await this._tryLoad(sources.api);
      return this._procesar(data);
    } catch {
      console.warn("[ProductService] fallo de API, cargando JSON local");
      const data = await this._tryLoad(sources.local);
      return this._procesar(data);
    }
  }

  // Obtiene datos de una URL con tiempo de espera y genera un error si falla
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

  // Procesa datos en raw en instancias de Bicicleta y Precio y los almacena en cache
  static _procesar(data) {
    // Lo que se deberia de esperar: data = [ { idModelo, modelo, productos: [ { … } ] }, … ]
    this.cache = data.map(({ idModelo, modelo, productos }) => ({
      idModelo,
      modelo,
      productos: productos.map(p => {
      // Asegurarse de que p.precio es un array y crea instancias de Precio para cada moneda
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
        precio:     preciosPorMoneda,       // Array de Precio
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

    return this.cache; // Obtener la lista de productos como objetos Bicicleta
  }
}
