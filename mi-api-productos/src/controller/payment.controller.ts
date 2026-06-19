import { Request, Response } from 'express';
import { PaymentService } from '../service/payment.service';

const service = new PaymentService();

export class PaymentController {

  //simularpago
  async process(req: Request, res: Response): Promise<void> {
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
