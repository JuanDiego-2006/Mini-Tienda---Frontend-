"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingController = void 0;
const shipping_service_1 = require("../service/shipping.service");
const service = new shipping_service_1.ShippingService();
class ShippingController {
    // GET /api/v1/shipping — lista todos los envíos
    async getAll(_req, res) {
        const shipping = await service.getAllShipping();
        res.status(200).json(shipping);
    }
    // GET /api/v1/shipping/:id — detalle de un envío
    async getById(req, res) {
        const id = parseInt(req.params.id);
        const shipping = await service.getShippingById(id);
        // Si no existe guía generada para ese id → 404 con código específico
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
}
exports.ShippingController = ShippingController;
