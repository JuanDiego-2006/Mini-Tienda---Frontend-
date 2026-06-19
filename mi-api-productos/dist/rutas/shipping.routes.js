"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipping_controller_1 = require("../controller/shipping.controller");
const router = (0, express_1.Router)();
const controller = new shipping_controller_1.ShippingController();
router.get('/', controller.getAll.bind(controller)); // GET /api/v1/shipping
router.get('/:id', controller.getById.bind(controller)); // GET /api/v1/shipping/:id
exports.default = router;
