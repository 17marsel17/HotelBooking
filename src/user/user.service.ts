import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserService, SearchUserParams } from './interface/user.interface';
import { User, UserDocument } from './entity/user.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(data: Partial<User>): Promise<User> {
    const user = await this.findByEmail(data.email || '');

    if (user) {
      throw new NotFoundException('Пользователь с таким email уже существует');
    }

    data.passwordHash = bcrypt.hashSync(data.passwordHash || '', 10);
    const newUser = await this.userModel.create(data);

    return newUser;
  }

  // TODO
  findAll(params: SearchUserParams): Promise<User[]> {
    let searchParams: FilterQuery<UserDocument> = {};
    if (params) {
      const { email, name, contactPhone } = params;

      if (email) {
        searchParams.email = { $regex: email, $options: 'i' };
      }
      if (name) {
        searchParams.name = { $regex: name, $options: 'i' };
      }
      if (contactPhone) {
        searchParams.contactPhone = { $regex: contactPhone, $options: 'i' };
      }
    }

    const users = this.userModel
      .find(searchParams)
      .limit(params.limit)
      .skip(params.offset)
      .exec();
    return users;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
