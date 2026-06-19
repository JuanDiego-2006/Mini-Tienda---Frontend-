"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./rutas/user.routes"));
const payment_routes_1 = __importDefault(require("./rutas/payment.routes"));
const shipping_routes_1 = __importDefault(require("./rutas/shipping.routes"));
const order_routes_1 = __importDefault(require("./rutas/order.routes"));
const app = (0, express_1.default)();
// Middleware: sin esto req.body sería undefined en todos los controllers
app.use(express_1.default.json());
// CORS: permite que Next.js (localhost:3000) consuma esta API (localhost:3001)
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use('/api/v1/orders', order_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/payments', payment_routes_1.default);
app.use('/api/v1/shipping', shipping_routes_1.default);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n Servidor corriendo en http://localhost:${PORT}\n`);
    console.log(`--- ORDERS ---`);
    console.log(`  GET    /api/v1/orders`);
    console.log(`  GET    /api/v1/orders/:id`);
    console.log(`  POST   /api/v1/orders`);
    console.log(`  PATCH  /api/v1/orders/:id/status`);
    console.log(`\n--- USERS ---`);
    console.log(`  GET    /api/v1/users`);
    console.log(`  POST   /api/v1/users`);
    console.log(`  POST   /api/v1/users/login`);
    console.log(`  GET    /api/v1/users/:id`);
    console.log(`  PUT    /api/v1/users/:id`);
    console.log(`  PATCH  /api/v1/users/:id`);
    console.log(`  DELETE /api/v1/users/:id`);
    console.log(`\n--- PAYMENTS ---`);
    console.log(`  GET    /api/v1/payments`);
    console.log(`  GET    /api/v1/payments/:id`);
    console.log(`  POST   /api/v1/payments`);
    console.log(`\n--- SHIPPING ---`);
    console.log(`  GET    /api/v1/shipping`);
    console.log(`  GET    /api/v1/shipping/:id`);
});
