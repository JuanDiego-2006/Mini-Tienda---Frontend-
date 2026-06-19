"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const router = (0, express_1.Router)();
const controller = new user_controller_1.UserController();
// IMPORTANTE: rutas fijas SIEMPRE antes que rutas con parámetros (:id)
// Si /:id fuera primero, Express capturaría "/login" como id="login"
router.get('/', controller.getAll.bind(controller)); // GET    /api/v1/users
router.post('/login', controller.login.bind(controller)); // POST   /api/v1/users/login
router.post('/', controller.register.bind(controller)); // POST   /api/v1/users
router.get('/:id', controller.getById.bind(controller)); // GET    /api/v1/users/:id
router.put('/:id', controller.update.bind(controller)); // PUT    /api/v1/users/:id
router.patch('/:id', controller.patch.bind(controller)); // PATCH  /api/v1/users/:id
router.delete('/:id', controller.delete.bind(controller)); // DELETE /api/v1/users/:id
exports.default = router;
