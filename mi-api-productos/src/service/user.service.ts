import { UserRepository } from '../repository/user.repository';
import { User, UserInput } from '../TypeScript/Productos';

const repository = new UserRepository();

export class UserService {

  async getAll(): Promise<User[]> {
    return repository.findAll();
  }

  async register(input: UserInput): Promise<User | 'EMAIL_EXISTS'> {
    const existing = await repository.findByEmail(input.email);
    if (existing) return 'EMAIL_EXISTS';
    return repository.save(input);
  }

  async login(email: string, password: string): Promise<User | undefined> {
    const user = await repository.findByEmail(email);
    if (!user || user.password !== password) return undefined;
    return user;
  }

  async getById(id: number): Promise<User | undefined> {
    return repository.findById(id);
  }

  async update(id: number, fields: { email: string; name: string }): Promise<User | undefined> {
    return repository.update(id, fields);
  }

  async patch(id: number, fields: Partial<Pick<User, 'email' | 'name' | 'role'>>): Promise<User | undefined> {
    return repository.patch(id, fields);
  }

  async delete(id: number): Promise<boolean> {
    return repository.delete(id);
  }
}
