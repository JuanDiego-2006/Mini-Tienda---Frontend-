"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controller/payment.controller");
const router = (0, express_1.Router)();
const controller = new payment_controller_1.PaymentController();
router.get('/', controller.getAll.bind(controller)); // GET    /api/v1/payments
router.get('/:id', controller.getById.bind(controller)); // GET    /api/v1/payments/:id
router.post('/', controller.process.bind(controller)); // POST   /api/v1/payments
exports.default = router;
