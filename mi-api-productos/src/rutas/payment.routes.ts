import { Router } from 'express';
import { PaymentController } from '../controller/payment.controller';

const router     = Router();
const controller = new PaymentController();

router.post('/', controller.process.bind(controller));

export default router;
