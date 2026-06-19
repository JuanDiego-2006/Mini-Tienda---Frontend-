import { Request, Response } from 'express';
import { ShippingService, VALID_SHIPPING_STATUSES } from '../service/shipping.service';

const service = new ShippingService();

export class ShippingController {

//get
  async getAll(_req: Request, res: Response): Promise<void> {
    const shipping = await service.getAllShipping();
    res.status(200).json(shipping);
  }
////id
  async getById(req: Request, res: Response): Promise<void> {
    const id       = parseInt(req.params.id);
    const shipping = await service.getShippingById(id);

    if (!shipping) {
      res.status(404).json({
        code: "SHIPPING_NOT_GENERATED",
        message: "El pedido aún no se ha enviado.",
        details: { id: "No se ha generado guía de envío para este pedido." }
      });
      return;
    }

    res.status(200).json(shipping);
  }

///crear
  async create(req: Request, res: Response): Promise<void> {
    const { orderId, productId, productName, userName,
            direccion, telefono, referencia, empresa,
            guia, status } = req.body;

    if (!orderId || !userName || !direccion || !telefono || !empresa || !guia) {
      res.status(422).json({
        code: "MISSING_FIELDS",
        message: "Faltan campos obligatorios.",
        details: { fields: "orderId, userName, direccion, telefono, empresa y guia son requeridos." }
      });
      return;
    }

    const orderIdNum = parseInt(orderId);
    if (isNaN(orderIdNum) || orderIdNum <= 0) {
      res.status(422).json({
        code: "INVALID_ORDER_ID",
        message: "El ID de pedido no es válido.",
        details: { orderId: "El orderId debe ser un número entero mayor a 0." }
      });
      return;
    }

    const newShipping = await service.createShipping({
      orderId:      orderIdNum,
      productId:    parseInt(productId)  || 0,
      productName:  productName          || "",
      userName,
      direccion,
      telefono,
      referencia:   referencia           || "",
      empresa,
      guia,
      fechaEstimada: "",  
      status:        status || "pendiente"
    });

    res.status(201).json(newShipping);
  }

//cambiarestado
  async updateStatus(req: Request, res: Response): Promise<void> {
    const id         = parseInt(req.params.id);
    const { status } = req.body;

    const result = await service.updateStatus(id, status);

    if (result === 'INVALID_STATUS') {
      res.status(422).json({
        code: "INVALID_SHIPPING_STATUS",
        message: "El estado de envío no es válido.",
        details: { status: `Los estados permitidos son: ${VALID_SHIPPING_STATUSES.join(', ')}.` }
      });
      return;
    }

    if (!result) {
      res.status(404).json({
        code: "SHIPPING_NOT_GENERATED",
        message: "No se encontró el envío.",
        details: { id: "No existe un envío con ese identificador." }
      });
      return;
    }

    res.status(200).json(result);
  }


  async delete(req: Request, res: Response): Promise<void> {
    const id      = parseInt(req.params.id);
    const deleted = await service.deleteShipping(id);

    if (!deleted) {
      res.status(404).json({
        code: "SHIPPING_NOT_GENERATED",
        message: "No se encontró el envío.",
        details: { id: "No existe un envío con ese identificador." }
      });
      return;
    }

    res.status(204).send();
  }
}
