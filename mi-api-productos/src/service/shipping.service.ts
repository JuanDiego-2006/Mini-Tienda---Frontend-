import { ShippingRepository } from '../repository/shipping.repository';
import { Shipping } from '../TypeScript/Productos';

const repository = new ShippingRepository();

export const VALID_SHIPPING_STATUSES = ["pendiente", "En camino", "Entregado"];

export class ShippingService {

  async getAllShipping(): Promise<Shipping[]> {
    return repository.findAll();
  }

  async getShippingById(id: number): Promise<Shipping | undefined> {
    return repository.findById(id);
  }

  async createShipping(input: Omit<Shipping, 'id'>): Promise<Shipping> {
    const newShipping: Shipping = {
      id: repository.getNextId(),
      ...input
    };
    return repository.save(newShipping);
  }

  async updateStatus(id: number, status: string): Promise<Shipping | undefined | 'INVALID_STATUS'> {
    if (!VALID_SHIPPING_STATUSES.includes(status)) return 'INVALID_STATUS';
    return repository.updateStatus(id, status);
  }

  async deleteShipping(id: number): Promise<boolean> {
    return repository.delete(id);
  }
}
