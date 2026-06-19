"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controller/order.controller");
const router = (0, express_1.Router)();
const controller = new order_controller_1.OrderController();
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.patch('/:id/status', controller.updateStatus.bind(controller));
router.delete('/:id', controller.delete.bind(controller)); // DELETE /api/v1/orders/:id
exports.default = router;
