import { PaymentRepository } from '../repository/payment.repository';
import { Payment, PaymentInput } from '../TypeScript/Productos';

const repository = new PaymentRepository();

const VALID_METHODS = ["tarjeta", "efectivo", "transferencia", "paypal"];

export class PaymentService {

  async processPayment(
    input: PaymentInput,
    userId: number
  ): Promise<Payment | 'INVALID_METHOD'> {

    if (!VALID_METHODS.includes(input.paymentMethod)) {
      return 'INVALID_METHOD';
    }

    const payment: Payment = {
      id:            repository.getNextId(),
      userId,
      orderId:       input.orderId,
      transactionId: `TXN-${Date.now()}`,
      status:        "approved",
      amount:        100.00   
    };

    return repository.save(payment);
  }
}
