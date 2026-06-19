"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
// arreglo de pagos
const db = [
    {
        id: 901,
        userId: 1,
        orderId: 501,
        transactionId: "TXN-001",
        status: "approved",
        amount: 91.00
    }
];
class PaymentRepository {
    // TodoPagos
    async findAll() {
        return db;
    }
    // idPago
    async findById(id) {
        return db.find(p => p.id === id);
    }
    async findByUserId(userId) {
        return db.filter(p => p.userId === userId);
    }
    // Guarda un pago nuevo
    async save(payment) {
        db.push(payment);
        return payment;
    }
    // Genera el siguiente id disponible
    getNextId() {
        return db.length > 0 ? db[db.length - 1].id + 1 : 901;
    }
}
exports.PaymentRepository = PaymentRepository;
