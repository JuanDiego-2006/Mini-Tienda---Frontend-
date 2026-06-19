"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingService = void 0;
const shipping_repository_1 = require("../repository/shipping.repository");
const repository = new shipping_repository_1.ShippingRepository();
class ShippingService {
    // Devuelve todos los envíos
    async getAllShipping() {
        return repository.findAll();
    }
    // Busca un envío por id
    async getShippingById(id) {
        return repository.findById(id);
    }
}
exports.ShippingService = ShippingService;
