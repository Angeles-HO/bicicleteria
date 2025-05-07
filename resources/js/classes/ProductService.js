import { Product } from "../classes/product.js"; 

export class ProductService {
  static async loadProducts() {
    const response = await fetch("../../resources/data/bicicletas.json");
    if (!response.ok) throw new Error('Error al cargar los productos');
    const data = await response.json();
    return data.map(categoria => ({
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
  }
}