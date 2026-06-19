import { User, UserInput } from '../TypeScript/Productos';

const db: User[] = [
  { id: 1, email: "admin@papeleria.com", password: "admin123", name: "Admin",      role: "admin"   },
  { id: 2, email: "juan@papeleria.com",  password: "juan123",  name: "Juan Diego", role: "cliente" }
];

export class UserRepository {

  async findAll(): Promise<User[]> {
    return db;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return db.find(u => u.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return db.find(u => u.id === id);
  }

  async save(input: UserInput): Promise<User> {
    const newId = db.length > 0 ? db[db.length - 1].id + 1 : 1;
    const newUser: User = { id: newId, ...input };
    db.push(newUser);
    return newUser;
  }

  async update(id: number, fields: { email: string; name: string }): Promise<User | undefined> {
    const user = db.find(u => u.id === id);
    if (!user) return undefined;
    user.email = fields.email;
    user.name  = fields.name;
    return user;
  }

  async patch(id: number, fields: Partial<Pick<User, 'email' | 'name' | 'role'>>): Promise<User | undefined> {
    const user = db.find(u => u.id === id);
    if (!user) return undefined;
    Object.assign(user, fields);
    return user;
  }

  async delete(id: number): Promise<boolean> {
    const index = db.findIndex(u => u.id === id);
    if (index === -1) return false;
    db.splice(index, 1);
    return true;
  }
}
