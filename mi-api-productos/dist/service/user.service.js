"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repository/user.repository");
const repository = new user_repository_1.UserRepository();
class UserService {
    // Devuelve todos los usuarios
    async getAll() {
        return repository.findAll();
    }
    // Registra un usuario nuevo
    // Regla: el email no puede estar duplicado → devuelve 'EMAIL_EXISTS' si ya existe
    async register(input) {
        const existing = await repository.findByEmail(input.email);
        if (existing)
            return 'EMAIL_EXISTS'; // señal de error para el controller
        return repository.save(input);
    }
    // Valida credenciales para el login
    // Devuelve el usuario si coinciden, undefined si no
    async login(email, password) {
        const user = await repository.findByEmail(email);
        // Comparamos el password directo (en producción real usarías bcrypt)
        if (!user || user.password !== password)
            return undefined;
        return user;
    }
    // Obtiene un perfil por id
    async getById(id) {
        return repository.findById(id);
    }
    // Actualiza email y nombre
    async update(id, fields) {
        return repository.update(id, fields);
    }
    // Actualiza solo los campos que vengan (PATCH)
    async patch(id, fields) {
        return repository.patch(id, fields);
    }
    // Elimina un usuario
    async delete(id) {
        return repository.delete(id);
    }
}
exports.UserService = UserService;
