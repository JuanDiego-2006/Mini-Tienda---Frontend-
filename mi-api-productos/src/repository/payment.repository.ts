import { Payment } from '../TypeScript/Productos';

const db: Payment[] = [];

export class PaymentRepository {

  async save(payment: Payment): Promise<Payment> {
    db.push(payment);
    return payment;
  }

  getNextId(): number {
    return db.length > 0 ? db[db.length - 1].id + 1 : 901;
  }
}
