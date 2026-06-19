"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_repository_1 = require("../repository/product.repository");
const repository = new product_repository_1.ProductRepository();
class ProductService {
    // Devuelve todos los productos
    async getAllProducts() {
        return repository.findAll();
    }
    // Busca uno por id, devuelve undefined si no existe
    async getProductById(id) {
        return repository.findById(id);
    }
    // Crea un producto nuevo
    async createProduct(input) {
        return repository.save(input);
    }
    // Reemplaza un producto completo (PUT)
    async updateProduct(id, input) {
        return repository.update(id, input);
    }
    // Actualiza campos parciales (PATCH)
    async patchProduct(id, fields) {
        return repository.patch(id, fields);
    }
    // Elimina un producto, devuelve true/false
    async deleteProduct(id) {
        return repository.delete(id);
    }
}
exports.ProductService = ProductService;
