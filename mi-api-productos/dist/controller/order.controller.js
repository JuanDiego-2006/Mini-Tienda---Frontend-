"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../service/order.service");
const service = new order_service_1.OrderService();
class OrderController {
    // GET /api/v1/orders
    async getAll(_req, res) {
        const orders = await service.getAllOrders();
        res.status(200).json(orders);
    }
    // GET /api/v1/orders/:id
    async getById(req, res) {
        const id = parseInt(req.params.id);
        const order = await service.getOrderById(id);
        if (!order) {
            res.status(404).json({
                code: "ORDER_NOT_FOUND",
                message: "El pedido no existe.",
                details: { id: "No se encontró ningún pedido con ese identificador." }
            });
            return;
        }
        res.status(200).json(order);
    }
    // POST /api/v1/orders — crea el pedido, siempre responde 201
    async create(req, res) {
        const result = await service.createOrder(req.body, 1);
        res.status(201).json(result);
    }
    // PATCH /api/v1/orders/:id/status
    async updateStatus(req, res) {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const result = await service.updateStatus(id, status);
        if (result === 'INVALID_STATUS') {
            res.status(422).json({
                code: "INVALID_ORDER_STATUS",
                message: "El estado enviado no es válido.",
                details: { status: `Los estados permitidos son: ${order_service_1.VALID_STATUSES.join(', ')}.` }
            });
            return;
        }
        if (!result) {
            res.status(404).json({
                code: "ORDER_NOT_FOUND",
                message: "El pedido no existe.",
                details: { id: "No se encontró ningún pedido con ese identificador." }
            });
            return;
        }
        res.status(200).json(result);
    }
    // DELETE /api/v1/orders/:id
    async delete(req, res) {
        const id = parseInt(req.params.id);
        const deleted = await service.deleteOrder(id);
        if (!deleted) {
            res.status(404).json({
                code: "ORDER_NOT_FOUND",
                message: "El pedido no existe.",
                details: { id: "No se encontró ningún pedido con ese identificador." }
            });
            return;
        }
        res.status(204).send();
    }
}
exports.OrderController = OrderController;
