export class Storage {
  static nameKey = "ItmSelec_" // alto sistema anti bugs eh

  static set(key, value) {
    if (!key) {
      console.error("Key is required");
      return false; 
    }

    if (value === undefined || value === null) {
      console.error("Value cannot be undefined or null");
      return false;
    }

    const storageKey = `${this.nameKey}${key}`; // evitar conflictos
    
    // comprobacion y ajustes dependiendo del tipo (Type) de dato
    const storageValue = typeof value === "object" ? JSON.stringify(value) : value;
    
    localStorage.setItem(storageKey, storageValue);
    return true;
  }
  
  static get(key, defaultValue = null) {
    if (!key) return defaultValue; // si no se encuentra la llave devolvemos NULL

    const storageKey = `${this.nameKey}${key}`;
    const value = localStorage.getItem(storageKey);

    // Filtro simple de typos
    // Intenta parsear JSON si el valor parece un objeto
    try {
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return value || defaultValue; // Si no es JSON, devuelve el valor crudo
    }
  }

  static remove(key) {
    if (!key) return false;
    localStorage.removeItem(`${this.nameKey}${key}`);
    return true;
  }

  static logOut() {
    this.remove("sessionActive");
    this.remove("sessionUser");
  }

  static TKAE(key) {
    return localStorage.getItem(`${this.nameKey}${key}`) !== null;
  }

  static keys() {
    return Object.keys(localStorage).filter(k => k.startsWith(this.nameKey));
  }
}