"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controller/product.controller");
const router = (0, express_1.Router)();
const controller = new product_controller_1.ProductController();
// .bind(controller) es necesario para que "this" funcione dentro del controller
router.get('/', controller.getAll.bind(controller)); // GET  /api/v1/products
router.get('/:id', controller.getById.bind(controller)); // GET  /api/v1/products/:id
router.post('/', controller.create.bind(controller)); // POST /api/v1/products
router.put('/:id', controller.update.bind(controller)); // PUT  /api/v1/products/:id
router.patch('/:id', controller.patch.bind(controller)); // PATCH /api/v1/products/:id
router.delete('/:id', controller.delete.bind(controller)); // DELETE /api/v1/products/:id
exports.default = router;
