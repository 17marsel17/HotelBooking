import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'email пользователя' })
  @IsString()
  @IsDefined()
  email: string;

  @ApiProperty({ description: 'Пароль' })
  @IsString()
  @IsDefined()
  password: string;

  @ApiProperty({ description: 'Имя пользователя' })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ description: 'Номер телефона' })
  @IsString()
  @IsDefined()
  contactPhone: string;

  @ApiProperty({ description: 'Роль пользователя' })
  @IsString()
  @IsDefined()
  role: string;
}
