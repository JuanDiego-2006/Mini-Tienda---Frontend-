import express from 'express';
import productRoutes  from './rutas/product.routes';
import userRoutes     from './rutas/user.routes';
import paymentRoutes  from './rutas/payment.routes';
import shippingRoutes from './rutas/shipping.routes';
import orderRoutes    from './rutas/order.routes';

const app = express();

app.use(express.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api/v1/products',  productRoutes);
app.use('/api/v1/orders',    orderRoutes);
app.use('/api/v1/users',     userRoutes);
app.use('/api/v1/payments',  paymentRoutes);
app.use('/api/v1/shipping',  shippingRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
