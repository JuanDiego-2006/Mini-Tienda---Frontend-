"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const db = [
    { id: 1, name: "Cuaderno Profesional Raya", price: 45.50, inStock: true },
    { id: 2, name: "Pluma Azul Bic", price: 8.00, inStock: true },
    { id: 3, name: "Tijeras Escolares", price: 25.00, inStock: false }
];
class ProductRepository {
    async findAll() {
        return db;
    }
    async findById(id) {
        return db.find(p => p.id === id);
    }
    async save(input) {
        const newId = db.length > 0 ? db[db.length - 1].id + 1 : 1;
        const newProduct = {
            id: newId,
            name: input.name,
            price: input.price,
            inStock: input.inStock ?? true
        };
        db.push(newProduct);
        return newProduct;
    }
    async update(id, input) {
        const index = db.findIndex(p => p.id === id);
        if (index === -1)
            return undefined;
        db[index] = { id, ...input, inStock: input.inStock ?? db[index].inStock };
        return db[index];
    }
    async patch(id, fields) {
        const index = db.findIndex(p => p.id === id);
        if (index === -1)
            return undefined;
        Object.assign(db[index], fields);
        return db[index];
    }
    async delete(id) {
        const index = db.findIndex(p => p.id === id);
        if (index === -1)
            return false;
        db.splice(index, 1);
        return true;
    }
}
exports.ProductRepository = ProductRepository;
