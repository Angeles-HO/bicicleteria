// Clase Filtro para aplicar filtros a una lista de productos
// Usa el principio de responsabilidad unica
export class Filtro {
  static aplicar(data, { modelo = 'todos', pago = 'todos', currency = 'todos', color = 'todos' }) {
    return data.map(cat => {

      // Filtra por modelo si corresponde
      if (modelo !== 'todos' && cat.idModelo !== modelo) return null;

      let prods = [...cat.productos];

      // Filtra por metodo de pago si corresponde
      if (pago !== 'todos') {
        prods = prods.filter(p => Array.isArray(p.getPaidMethod?.()) && p.getPaidMethod().includes(pago));
      }

      // Filtra por moneda si corresponde
      if (currency !== 'todos') {
        prods = prods.filter(p => typeof p.hasCurrency === 'function' && p.hasCurrency(currency));
      }

      // Filtra por color si corresponde
      if (color !== 'todos') {
        const buscado = color.toLowerCase().trim();
        prods = prods.filter(p => {
          const colores = p.getColores?.();
          if (!Array.isArray(colores)) return false;
          return colores.some(c => {
            if (typeof c === 'object' && c !== null && 'color' in c) {
              return c.color.toLowerCase().trim() === buscado;
            }
            return false;
          });
        });
      }

      // Devuelve la categoria solo si tiene productos despues de filtrar
      return prods.length ? { ...cat, productos: prods } : null;
      
    }).filter(Boolean); // Elimina categorias vacias o nulas
  }
}