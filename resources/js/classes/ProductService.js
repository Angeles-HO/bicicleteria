import { Product } from "../classes/product.js"; 

export class ProductService {
  // Un sistema de cache (vi que es buena practica y para test viene bien)
  static cache = null;

  static async loadProducts() {
    //  loadProducts(source = "api")
    if (this.cache) return this.cache;

    // const response = source === "api" ? "http://localhost:1337/api/productos" : "../../resources/data/bicicletas.json"
    const response = await fetch("../../resources/data/bicicletas.json");

    // Integracion con llamadas a una API que puede ser local o remota, "API" http o "local" json.

    if (!response.ok) throw new Error('Error al cargar los productos');

    const data = await response.json();

    this.cache = data.map(categoria => ({
      idModelo: categoria.idModelo,
      modelo: categoria.modelo,
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