import { User } from '../entity/user.entity';
import { Types } from 'mongoose';

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: string | Types.ObjectId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;

  // При поиске поля email, name и contactPhone проверяются на частичное совпадение
  findAll(params: SearchUserParams): Promise<User[]>;
}
