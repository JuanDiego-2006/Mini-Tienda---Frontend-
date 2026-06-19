import { OrderRepository } from '../repository/order.repository';
import { Order, OrderInput } from '../TypeScript/Productos';

const orderRepo = new OrderRepository();

export const VALID_STATUSES = ["pending", "shipped", "delivered", "cancelled"];

export class OrderService {

  async getAllOrders(): Promise<Order[]> {
    return orderRepo.findAll();
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return orderRepo.findById(id);
  }

 
  async createOrder(input: OrderInput, userId: number): Promise<Order> {

    const itemsConPrecio = input.items.map(item => ({
      productId: item.productId,
      quantity:  item.quantity,
      unitPrice: item.unitPrice ?? 0 
    }));

    const total = itemsConPrecio.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const newOrder: Order = {
      id: orderRepo.getNextId(),
      userId,
      status: "pending",
      total: Math.round(total * 100) / 100,
      createdAt: new Date().toISOString(),
      items: itemsConPrecio
    };

    return orderRepo.save(newOrder);
  }

  async updateStatus(id: number, status: string): Promise<Order | undefined | 'INVALID_STATUS'> {
    if (!VALID_STATUSES.includes(status)) return 'INVALID_STATUS';
    return orderRepo.updateStatus(id, status);
  }

  async deleteOrder(id: number): Promise<boolean> {
    return orderRepo.delete(id);
  }
}
