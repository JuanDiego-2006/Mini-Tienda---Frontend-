import { Request, Response } from 'express';
import { OrderService, VALID_STATUSES } from '../service/order.service';

const service = new OrderService();

export class OrderController {

  async getAll(_req: Request, res: Response): Promise<void> {
    const orders = await service.getAllOrders();
    res.status(200).json(orders);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id    = parseInt(req.params.id);
    const order = await service.getOrderById(id);

    if (!order) {
      res.status(404).json({
        code: "ORDER_NOT_FOUND",
        message: "El pedido no existe.",
        details: { id: "No se encontró ningún pedido con ese identificador." }
      });
      return;
    }

    res.status(200).json(order);
  }

  async create(req: Request, res: Response): Promise<void> {
    const result = await service.createOrder(req.body, 1);
    res.status(201).json(result);
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const id         = parseInt(req.params.id);
    const { status } = req.body;

    const result = await service.updateStatus(id, status);

    if (result === 'INVALID_STATUS') {
      res.status(422).json({
        code: "INVALID_ORDER_STATUS",
        message: "El estado enviado no es válido.",
        details: { status: `Los estados permitidos son: ${VALID_STATUSES.join(', ')}.` }
      });
      return;
    }

    if (!result) {
      res.status(404).json({
        code: "ORDER_NOT_FOUND",
        message: "El pedido no existe.",
        details: { id: "No se encontró ningún pedido con ese identificador." }
      });
      return;
    }

    res.status(200).json(result);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id      = parseInt(req.params.id);
    const deleted = await service.deleteOrder(id);

    if (!deleted) {
      res.status(404).json({
        code: "ORDER_NOT_FOUND",
        message: "El pedido no existe.",
        details: { id: "No se encontró ningún pedido con ese identificador." }
      });
      return;
    }

    res.status(204).send();
  }
}
