import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Role } from '../common/role/role.enum';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        `Пользователь с email=${email} не найден`,
      );
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      return true;
    }

    throw new UnauthorizedException('Неверный пароль');
  }

  async register(registerDto: RegisterDto) {
    const userData = {
      email: registerDto.email,
      passwordHash: await bcrypt.hash(registerDto.password, 10),
      name: registerDto.name,
      contactPhone: registerDto.contactPhone,
      role: Role.client,
    };

    try {
      return this.userService.create(userData);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
