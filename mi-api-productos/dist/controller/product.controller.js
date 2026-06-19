"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../service/product.service");
const service = new product_service_1.ProductService();
class ProductController {
    async getAll(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        if (page <= 0) {
            res.status(400).json({
                code: "INVALID_QUERY_PARAMS",
                message: "Parámetros de búsqueda incorrectos.",
                details: { page: "El valor de la página debe ser un número entero mayor a 0." }
            });
            return;
        }
        let products = await service.getAllProducts();
        if (search) {
            products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        const total = products.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const paginated = products.slice(start, start + limit);
        res.status(200).json({
            data: paginated,
            meta: { page, limit, total, totalPages }
        });
    }
    async getById(req, res) {
        const id = parseInt(req.params.id);
        const product = await service.getProductById(id);
        if (!product) {
            res.status(404).json({
                code: "PRODUCT_NOT_FOUND",
                message: "El producto no existe.",
                details: { id: "No se encontró ningún artículo con el identificador proporcionado." }
            });
            return;
        }
        res.status(200).json(product);
    }
    async create(req, res) {
        const { name, price, inStock } = req.body; // desestructuramos el body
        if (!price || price <= 0) {
            res.status(422).json({
                code: "INVALID_PRICE_VALUE",
                message: "El precio debe ser mayor a 0.",
                details: { price: "El valor económico asignado al artículo no puede ser cero o negativo." }
            });
            return;
        }
        const product = await service.createProduct({ name, price, inStock });
        res.status(201).json(product);
    }
    async update(req, res) {
        const id = parseInt(req.params.id);
        const { name, price, inStock } = req.body;
        const product = await service.updateProduct(id, { name, price, inStock });
        if (!product) {
            res.status(404).json({
                code: "PRODUCT_NOT_FOUND",
                message: "El producto no existe.",
                details: { id: "No se encontró ningún artículo con el identificador proporcionado." }
            });
            return;
        }
        res.status(200).json(product);
    }
    async patch(req, res) {
        const id = parseInt(req.params.id);
        const product = await service.patchProduct(id, req.body);
        if (!product) {
            res.status(404).json({
                code: "PRODUCT_NOT_FOUND",
                message: "El producto no existe.",
                details: { id: "No se encontró ningún artículo con el identificador proporcionado." }
            });
            return;
        }
        res.status(200).json(product);
    }
    async delete(req, res) {
        const id = parseInt(req.params.id);
        const deleted = await service.deleteProduct(id);
        if (!deleted) {
            res.status(404).json({
                code: "PRODUCT_NOT_FOUND",
                message: "El producto no existe.",
                details: { id: "No se encontró ningún artículo con el identificador proporcionado." }
            });
            return;
        }
        res.status(204).send();
    }
}
exports.ProductController = ProductController;
