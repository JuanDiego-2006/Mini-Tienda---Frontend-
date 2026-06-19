import { Router } from 'express';
import { ShippingController } from '../controller/shipping.controller';

const router     = Router();
const controller = new ShippingController();

router.get('/',              controller.getAll.bind(controller));        
router.get('/:id',           controller.getById.bind(controller));     
router.post('/',             controller.create.bind(controller));     
router.patch('/:id/status',  controller.updateStatus.bind(controller)); 
router.delete('/:id',        controller.delete.bind(controller));      

export default router;
