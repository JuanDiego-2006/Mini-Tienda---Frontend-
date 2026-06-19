import { Router } from 'express';
import { UserController } from '../controller/user.controller';

const router     = Router();
const controller = new UserController();


router.get('/',       controller.getAll.bind(controller));   
router.post('/login', controller.login.bind(controller));   
router.post('/',      controller.register.bind(controller)); 
router.get('/:id',    controller.getById.bind(controller));  
router.put('/:id',    controller.update.bind(controller));  
router.patch('/:id',  controller.patch.bind(controller));  
router.delete('/:id', controller.delete.bind(controller));   

export default router;
