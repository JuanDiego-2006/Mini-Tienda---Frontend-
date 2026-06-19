import { Product, ProductInput } from '../TypeScript/Productos';

const db: Product[] = [
  { id: 1, name: "Cuaderno Profesional Raya",           price: 45.50,  inStock: true  },
  { id: 2, name: "Lápiz Mirado Número 2",               price: 7.00,   inStock: true  },
  { id: 3, name: "Juego de Geometría Maped",            price: 89.90,  inStock: true  },
  { id: 4, name: "Caja de Colores Prismacolor 24 pzas", price: 240.00, inStock: true  },
  { id: 5, name: "Pegamento en Barra Pritt Grande",     price: 35.00,  inStock: false },
  { id: 6, name: "Pluma Bic Cristal Azul 12 pzas",      price: 48.00,  inStock: true  },
  { id: 7, name: "Sacapuntas de Depósito Metal",        price: 15.50,  inStock: true  },
  { id: 8, name: "Goma de Borrar Factis",               price: 8.00,   inStock: true  },
];

export class ProductRepository {

  async findAll(): Promise<Product[]> {
    return db;
  }

  async findById(id: number): Promise<Product | undefined> {
    return db.find(p => p.id === id);
  }

  async save(input: ProductInput): Promise<Product> {
    const newId = db.length > 0 ? db[db.length - 1].id + 1 : 1;
    const newProduct: Product = {
      id: newId,
      name: input.name,
      price: input.price,
      inStock: input.inStock ?? true
    };
    db.push(newProduct);
    return newProduct;
  }

  async update(id: number, input: ProductInput): Promise<Product | undefined> {
    const index = db.findIndex(p => p.id === id); 
    if (index === -1) return undefined;            
    db[index] = { id, ...input, inStock: input.inStock ?? db[index].inStock };
    return db[index];
  }

  async patch(id: number, fields: Partial<ProductInput>): Promise<Product | undefined> {
    const index = db.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    Object.assign(db[index], fields);
    return db[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = db.findIndex(p => p.id === id);
    if (index === -1) return false;
    db.splice(index, 1);
    return true;
  }
}
