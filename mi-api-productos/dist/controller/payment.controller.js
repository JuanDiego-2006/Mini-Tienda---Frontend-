"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../service/payment.service");
const service = new payment_service_1.PaymentService();
class PaymentController {
    //ver
    async getAll(req, res) {
        const payments = await service.getAllPayments();
        res.status(200).json(payments);
    }
    //detales
    async getById(req, res) {
        const id = parseInt(req.params.id); // convertimos string a número
        const payment = await service.getPaymentById(id);
        if (!payment) {
            res.status(404).json({
                code: "PAYMENT_NOT_FOUND",
                message: "El pago no existe.",
                details: { id: "No se encontró ningún pago con ese identificador." }
            });
            return;
        }
        res.status(200).json(payment);
    }
    //agregarPago
    async process(req, res) {
        const { orderId, paymentMethod } = req.body;
        if (!orderId || !paymentMethod) {
            res.status(422).json({
                code: "MISSING_FIELDS",
                message: "Faltan campos obligatorios.",
                details: { fields: "orderId y paymentMethod son requeridos." }
            });
            return;
        }
        const result = await service.processPayment({ orderId, paymentMethod }, 1);
        if (result === 'INVALID_METHOD') {
            res.status(422).json({
                code: "PAYMENT_REJECTED",
                message: "Pago rechazado.",
                details: { paymentMethod: "El método de pago no es válido. Usa: tarjeta, efectivo, transferencia o paypal." }
            });
            return;
        }
        res.status(201).json(result);
    }
}
exports.PaymentController = PaymentController;
