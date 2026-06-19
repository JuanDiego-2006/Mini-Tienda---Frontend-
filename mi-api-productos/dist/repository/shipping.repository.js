"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingRepository = void 0;
// Simula la tabla "shipping" con datos completos de ejemplo
const db = [
    {
        id: 1,
        orderId: 501,
        productId: 1,
        productName: "Cuaderno Profesional Raya",
        userName: "Juan Diego Ramos",
        direccion: "Calle Reforma #45, Col. Centro",
        telefono: "9612345678",
        referencia: "Casa blanca con portón negro, frente a la farmacia",
        empresa: "DHL",
        guia: "DHL-2026-00123",
        fechaEstimada: "2026-06-20",
        status: "En camino"
    },
    {
        id: 2,
        orderId: 502,
        productId: 2,
        productName: "Pluma Azul Bic",
        userName: "Gisela Vianey Ruiz",
        direccion: "Av. Insurgentes #200, Col. Moderna",
        telefono: "9619876543",
        referencia: "Edificio color beige, departamento 3B",
        empresa: "FedEx",
        guia: "FDX-2026-00456",
        fechaEstimada: "2026-06-22",
        status: "pendiente"
    }
];
class ShippingRepository {
    // Devuelve todos los envíos
    async findAll() {
        return db;
    }
    // Busca un envío por su id
    async findById(id) {
        return db.find(s => s.id === id);
    }
    // Busca envío por id del pedido
    async findByOrderId(orderId) {
        return db.find(s => s.orderId === orderId);
    }
}
exports.ShippingRepository = ShippingRepository;
