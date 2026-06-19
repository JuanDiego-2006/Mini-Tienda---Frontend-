"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_repository_1 = require("../repository/payment.repository");
const repository = new payment_repository_1.PaymentRepository();
// Métodos de pago válidos que acepta el sistema
const VALID_METHODS = ["tarjeta", "efectivo", "transferencia", "paypal"];
class PaymentService {
    // Devuelve todos los pagos
    async getAllPayments() {
        return repository.findAll();
    }
    // Busca un pago por id
    async getPaymentById(id) {
        return repository.findById(id);
    }
    // Devuelve todos los pagos de un usuario
    async getPaymentsByUser(userId) {
        return repository.findByUserId(userId);
    }
    // Procesa un pago simulado
    // Reglas:
    //   - El método de pago debe ser válido
    //   - Simulamos aprobación automática (sin banco real)
    async processPayment(input, userId) {
        // Validamos que el método de pago exista en nuestra lista
        if (!VALID_METHODS.includes(input.paymentMethod)) {
            return 'INVALID_METHOD'; // señal de error para el controller
        }
        // Simulamos un monto fijo de 100 pesos por ahora
        // En un sistema real buscaríamos el total del pedido por input.orderId
        const simulatedAmount = 100.00;
        const payment = {
            id: repository.getNextId(),
            userId,
            orderId: input.orderId,
            // TXN- + timestamp en milisegundos = ID de transacción único
            transactionId: `TXN-${Date.now()}`,
            status: "approved", // simulamos aprobación automática
            amount: simulatedAmount
        };
        return repository.save(payment);
    }
}
exports.PaymentService = PaymentService;
