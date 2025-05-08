import { User } from '../classes/user.js';
import { Storage } from '../classes/storage.js';

export class AuthService {
  static register(username, name, surname, email, password) {

    const users = Storage.get('users') || [];
    
    if (users.some(u => u._email === email)) { // mejor que usar nombre u usuario
      throw new Error('El usuario ya existe');
    }

    users.push(new User(username, name, surname, email, password));

    Storage.set('users', users);
  }

  static login(email, password) {
    const users = Storage.get('users') || [];
    const user = users.find(u => u._email === email && u._password === password);
    if (!user) throw new Error('Credenciales invalidas');
    Storage.set('currentUser', user);
    return user;
  }

  static logout() {
    Storage.remove('currentUser');
  }
}