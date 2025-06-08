import { Product } from "../classes/product.js";

export class ProductService {
  static cache = null;

  static async loadProducts() {
    if (this.cache) return this.cache;

    const sources = {
      api: "/api/productos",
      local: "../../resources/data/bicicletas.json"
    };

    // Sistema try, try catch para manejar y probar 2 metodos de carga de datos
    try {
      const data = await this._tryLoad(sources.api);
      return this._procesar(data);
    } catch (apiError) {
      console.warn("[ProductService] API error, probando JSON local...", apiError);
      try {
        const data = await this._tryLoad(sources.local);
        return this._procesar(data);
      } catch (localError) {
        console.error("[ProductService] Error en ambos metodos:");
        throw new Error("No se pudieron cargar los productos desde la API ni desde el JSON local.", localError);
      }
    }
  }

  static async _tryLoad(url) {
    // Utilizamos Promise.race para manejar el timeout
    const response = await Promise.race([
      // Intentamos obtener los datos de la URL del parametro
      fetch(url),
      // Si no se obtiene respuesta en 5 (ms) segundos, rechazamos la promesa con un error de timeout
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout al acceder a ${url}`)), 5000)
      )
    ]);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al acceder a ${url}`);
    }

    // Si se establece una respuesta exitosa, convertimos la respuesta a JSON
    return response.json();
  }

  // Procesa los datos obtenidos de la API o del JSON local
  static _procesar(data) {
    this.cache = data.map(categoria => ({
      idModelo: categoria.idModelo,
      modelo: categoria.modelo,
      producto2: categoria.productos,
      productos: categoria.productos.map(p => new Product(
        p.id,
        p.marca,
        p.nombre,
        p.colores,
        p.precio,
        p.etiquetas,
        p.paidMethod,
        p.stock,
        p.imagen,
        p.descripcion,
        categoria.idModelo,
        categoria.modelo
      ))
    }));

    return this.cache;
  }
}
