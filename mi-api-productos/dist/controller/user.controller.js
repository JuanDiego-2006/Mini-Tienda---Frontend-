"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../service/user.service");
const service = new user_service_1.UserService();
class UserController {
    async getAll(req, res) {
        const users = await service.getAll();
        const result = users.map(({ password, ...u }) => u);
        res.status(200).json(result);
    }
    async register(req, res) {
        const { email, password, name, role } = req.body;
        if (!email || !password || !name || !role) {
            res.status(422).json({
                code: "MISSING_FIELDS",
                message: "Faltan campos obligatorios.",
                details: { fields: "email, password, name y role son requeridos." }
            });
            return;
        }
        const result = await service.register({ email, password, name, role });
        if (result === 'EMAIL_EXISTS') {
            res.status(409).json({
                code: "EMAIL_ALREADY_EXISTS",
                message: "El correo ya está registrado.",
                details: { email: "Esta dirección de correo electrónico ya está en uso." }
            });
            return;
        }
        res.status(201).json({ message: "Usuario registrado exitosamente." });
    }
    async login(req, res) {
        const { email, password } = req.body;
        const user = await service.login(email, password);
        if (!user) {
            res.status(401).json({
                code: "INVALID_CREDENTIALS",
                message: "Correo o contraseña incorrectos.",
                details: { auth: "Las credenciales proporcionadas no coinciden con ningún registro activo." }
            });
            return;
        }
        res.status(200).json({
            message: "Login correcto",
            name: user.name,
            role: user.role
        });
    }
    async getById(req, res) {
        const id = parseInt(req.params.id);
        const user = await service.getById(id);
        if (!user) {
            res.status(404).json({
                code: "USER_NOT_FOUND",
                message: "Usuario no encontrado.",
                details: { id: "No existe un usuario con ese identificador." }
            });
            return;
        }
        const { password, ...userSinPassword } = user;
        res.status(200).json(userSinPassword);
    }
    async update(req, res) {
        const id = parseInt(req.params.id);
        const { email, name } = req.body;
        if (!name || name.trim() === '') {
            res.status(422).json({
                code: "INVALID_NAME",
                message: "Nombre inválido.",
                details: { name: "El nombre proporcionado no puede estar vacío." }
            });
            return;
        }
        const user = await service.update(id, { email, name });
        if (!user) {
            res.status(404).json({
                code: "USER_NOT_FOUND",
                message: "Usuario no encontrado.",
                details: { id: "No existe un usuario con ese identificador." }
            });
            return;
        }
        res.status(200).json({ message: "Perfil actualizado correctamente." });
    }
    async patch(req, res) {
        const id = parseInt(req.params.id);
        const { email, name, role } = req.body;
        const fields = {};
        if (email !== undefined)
            fields.email = email;
        if (name !== undefined)
            fields.name = name;
        if (role !== undefined)
            fields.role = role;
        if (Object.keys(fields).length === 0) {
            res.status(422).json({
                code: "NO_FIELDS",
                message: "Debes enviar al menos un campo para actualizar.",
                details: { body: "El body está vacío o no contiene campos válidos." }
            });
            return;
        }
        const user = await service.patch(id, fields);
        if (!user) {
            res.status(404).json({
                code: "USER_NOT_FOUND",
                message: "Usuario no encontrado.",
                details: { id: "No existe un usuario con ese identificador." }
            });
            return;
        }
        const { password, ...userSinPassword } = user;
        res.status(200).json(userSinPassword);
    }
    async delete(req, res) {
        const id = parseInt(req.params.id);
        const deleted = await service.delete(id);
        if (!deleted) {
            res.status(404).json({
                code: "USER_NOT_FOUND",
                message: "Usuario no encontrado.",
                details: { id: "No existe un usuario con ese identificador." }
            });
            return;
        }
        res.status(204).send();
    }
}
exports.UserController = UserController;
