export class Usuario {
    // Constructor para manejo de un Usuario que espera 5 parametros
    constructor(username, name, surname, email, password) {
      this._username = username;
      this._name = name;
      this._surname = surname;
      this._email = email;
      this._password = password;
    }
  
    getUsrName() {
        return this._username;
    }

    getName() {
        return this._name;
    }

    getSurName() {
        return this._surname;
    }

    getEmail() {
        return this._email;
    }

    getPsword() {
        return this._password;
    }
}