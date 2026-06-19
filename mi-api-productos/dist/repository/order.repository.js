"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const db = [
    {
        id: 501,
        userId: 1,
        status: "pending",
        total: 91.00,
        createdAt: "2026-05-29T10:00:00Z",
        items: [
            { productId: 1, quantity: 2, unitPrice: 45.50 }
        ]
    },
    {
        id: 502,
        userId: 2,
        status: "shipped",
        total: 16.00,
        createdAt: "2026-05-30T09:00:00Z",
        items: [
            { productId: 2, quantity: 2, unitPrice: 8.00 }
        ]
    }
];
class OrderRepository {
    async findAll() {
        return db;
    }
    async findById(id) {
        return db.find(o => o.id === id);
    }
    async save(order) {
        db.push(order);
        return order;
    }
    async updateStatus(id, status) {
        const order = db.find(o => o.id === id);
        if (!order)
            return undefined;
        order.status = status;
        return order;
    }
    // Elimina un pedido por id, devuelve true si existía
    async delete(id) {
        const index = db.findIndex(o => o.id === id);
        if (index === -1)
            return false;
        db.splice(index, 1);
        return true;
    }
    getNextId() {
        return db.length > 0 ? db[db.length - 1].id + 1 : 501;
    }
}
exports.OrderRepository = OrderRepository;
