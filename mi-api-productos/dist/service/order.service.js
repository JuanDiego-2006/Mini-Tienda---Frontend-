"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = exports.VALID_STATUSES = void 0;
const order_repository_1 = require("../repository/order.repository");
const orderRepo = new order_repository_1.OrderRepository();
exports.VALID_STATUSES = ["pending", "shipped", "delivered", "cancelled"];
class OrderService {
    async getAllOrders() {
        return orderRepo.findAll();
    }
    async getOrderById(id) {
        return orderRepo.findById(id);
    }
    // Crea un pedido nuevo
    // Ya no valida stock aquí porque los productos vienen del catálogo de Next.js
    // El precio y nombre vienen del frontend — en producción real vendrían de la BD
    async createOrder(input, userId) {
        // Calculamos el total a partir de los datos que manda el cliente
        const itemsConPrecio = input.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice ?? 0 // el frontend manda el precio por unidad
        }));
        const total = itemsConPrecio.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const newOrder = {
            id: orderRepo.getNextId(),
            userId,
            status: "pending",
            total: Math.round(total * 100) / 100,
            createdAt: new Date().toISOString(),
            items: itemsConPrecio
        };
        return orderRepo.save(newOrder);
    }
    async updateStatus(id, status) {
        if (!exports.VALID_STATUSES.includes(status))
            return 'INVALID_STATUS';
        return orderRepo.updateStatus(id, status);
    }
    // Elimina un pedido
    async deleteOrder(id) {
        return orderRepo.delete(id);
    }
}
exports.OrderService = OrderService;
