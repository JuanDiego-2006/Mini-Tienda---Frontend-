import { Router } from 'express';
import { OrderController } from '../controller/order.controller';

const router     = Router();
const controller = new OrderController();

router.get('/',             controller.getAll.bind(controller));
router.get('/:id',          controller.getById.bind(controller));
router.post('/',            controller.create.bind(controller));
router.patch('/:id/status', controller.updateStatus.bind(controller));
router.delete('/:id',       controller.delete.bind(controller));

export default router;
