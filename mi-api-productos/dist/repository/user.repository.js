"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
// Simula la tabla "users" con 2 usuarios: un admin y un cliente
const db = [
    { id: 1, email: "admin@papeleria.com", password: "admin123", name: "Admin", role: "admin" },
    { id: 2, email: "juan@papeleria.com", password: "juan123", name: "Juan Diego", role: "cliente" }
];
class UserRepository {
    // Devuelve todos los usuarios (para el GET /users)
    async findAll() {
        return db;
    }
    // Busca usuario por email (para el login y validar duplicados)
    async findByEmail(email) {
        return db.find(u => u.email === email);
    }
    // Busca usuario por id (para ver perfil)
    async findById(id) {
        return db.find(u => u.id === id);
    }
    // Registra un nuevo usuario
    async save(input) {
        const newId = db.length > 0 ? db[db.length - 1].id + 1 : 1;
        const newUser = { id: newId, ...input };
        db.push(newUser);
        return newUser;
    }
    // Actualiza email y nombre de un usuario (PUT)
    async update(id, fields) {
        const user = db.find(u => u.id === id);
        if (!user)
            return undefined;
        user.email = fields.email;
        user.name = fields.name;
        return user;
    }
    // Actualiza SOLO los campos que vengan (PATCH)
    // Partial<User> significa que cualquier campo es opcional
    async patch(id, fields) {
        const user = db.find(u => u.id === id);
        if (!user)
            return undefined;
        // Object.assign copia solo las propiedades presentes, sin borrar las demás
        Object.assign(user, fields);
        return user;
    }
    // Elimina un usuario por id
    async delete(id) {
        const index = db.findIndex(u => u.id === id);
        if (index === -1)
            return false;
        db.splice(index, 1);
        return true;
    }
}
exports.UserRepository = UserRepository;
