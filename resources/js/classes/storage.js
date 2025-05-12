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
  
  /**
   * @returns Obtiene los datos de la llave que se recive, si no se encuentra la llave principal devolvemos null
  */
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

  /**
   * @returns Remover las llaves que se reciven
  */
  static remove(key) {
    if (!key) return false;
    localStorage.removeItem(`${this.nameKey}${key}`);
    return true;
  }

  /**
   * @returns Elimina los datos simulando que se salio de la cuenta
  */
  static logOut() {
    this.remove("sessionUser");
    this.remove("sessionActive");
  }

  /**
   * @returns Elimina los todos los datos que tengan que ver con el usuario registrado (actualmente solo 1, en futuro mas)
  */
  static removeUser() {
    this.remove("regDATAform");
    this.remove("sessionUser");
    this.remove("sessionActive");
  }

  /**
   * @returns Verifica que la llave que se recive ("string") y verifica que no sea null.
  */
  static TKAE(key) {
    return localStorage.getItem(`${this.nameKey}${key}`) !== null;
  }

  /**
   * @returns Devuelve todas las llaves actualmente existentes
  */
  static keys() {
    return Object.keys(localStorage).filter(k => k.startsWith(this.nameKey));
  }
}