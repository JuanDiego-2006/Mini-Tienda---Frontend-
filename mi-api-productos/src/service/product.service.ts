import { ProductRepository } from '../repository/product.repository';
import { Product, ProductInput } from '../TypeScript/Productos';

const repository = new ProductRepository();

export class ProductService {

  async getAllProducts(): Promise<Product[]> {
    return repository.findAll();
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return repository.findById(id);
  }

  async createProduct(input: ProductInput): Promise<Product> {
    return repository.save(input);
  }

  async updateProduct(id: number, input: ProductInput): Promise<Product | undefined> {
    return repository.update(id, input);
  }

  async patchProduct(id: number, fields: Partial<ProductInput>): Promise<Product | undefined> {
    return repository.patch(id, fields);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return repository.delete(id);
  }
}
