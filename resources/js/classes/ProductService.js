// Importar la clase Product desde el archivo product.js
import { Product } from "../classes/product.js"; 

export class ProductService {
  static async loadProducts() {
    const response = await fetch("../../../data/bicicletas.json");
    if (!response.ok) throw new Error("Error en la carga de productos");
    const data = await response.json();
    return data.flatMap(cat => 
      cat.productos.map(p => new Product(
        p.id, 
        p.marca, 
        p.nombre,
        p.stock
      ))
    );
  }
}