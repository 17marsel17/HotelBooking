import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserParams } from './interface/user.interface';
import { RolesGuard } from '../common/role/roles.guard';
import { Roles } from '../common/role/roles.decorator';
import { Role } from '../common/role/role.enum';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';

@Controller('/api')
@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Позволяет пользователю с ролью admin создать пользователя в системе
  @Roles(Role.admin)
  @Post('/admin/users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create({
      email: createUserDto.email,
      passwordHash: createUserDto.password,
      name: createUserDto.name,
      role: createUserDto.role,
      contactPhone: createUserDto.contactPhone,
    });
  }

  // Позволяет пользователю с ролью admin получить всех пользователей
  @Roles(Role.admin)
  @Get('/admin/users')
  getUsersFromAdmin(@Query() params: SearchUserParams) {
    return this.userService.findAll(params);
  }

  // Позволяет пользователю с ролью manager получить всех пользователей
  @Roles(Role.manager)
  @Get('/manager/users')
  getUsersFromManager(@Query() params: SearchUserParams) {
    return this.userService.findAll(params);
  }
}
