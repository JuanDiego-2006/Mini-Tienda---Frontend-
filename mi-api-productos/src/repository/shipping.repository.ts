import { Shipping } from '../TypeScript/Productos';

const db: Shipping[] = [
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
    fechaEstimada: "",
    status: "En camino"
  },
  {
    id: 2,
    orderId: 502,
    productId: 2,
    productName: "Pluma Bic Cristal Azul 12 pzas",
    userName: "Gisela Vianey Ruiz",
    direccion: "Av. Insurgentes #200, Col. Moderna",
    telefono: "9619876543",
    referencia: "Edificio color beige, departamento 3B",
    empresa: "FedEx",
    guia: "FDX-2026-00456",
    fechaEstimada: "",
    status: "pendiente"
  }
];

export class ShippingRepository {

  async findAll(): Promise<Shipping[]> {
    return db;
  }

  async findById(id: number): Promise<Shipping | undefined> {
    return db.find(s => s.id === id);
  }

  async save(shipping: Shipping): Promise<Shipping> {
    db.push(shipping);
    return shipping;
  }

  async updateStatus(id: number, status: string): Promise<Shipping | undefined> {
    const shipping = db.find(s => s.id === id);
    if (!shipping) return undefined;
    shipping.status = status;
    return shipping;
  }

  async delete(id: number): Promise<boolean> {
    const index = db.findIndex(s => s.id === id);
    if (index === -1) return false;
    db.splice(index, 1);
    return true;
  }

  getNextId(): number {
    return db.length > 0 ? db[db.length - 1].id + 1 : 1;
  }
}
