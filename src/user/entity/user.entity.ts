import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User;

@Schema()
export class User {
  @ApiProperty({ description: 'email' })
  @Prop({ required: true, unuque: true })
  email: string;

  @ApiProperty({ description: 'Пароль' })
  @Prop({ required: true })
  passwordHash: string;

  @ApiProperty({ description: 'Имя' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Номер телефона' })
  @Prop({ required: false })
  contactPhone: string;

  @ApiProperty({ description: 'Роль' })
  @Prop({ required: true, default: 'client' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
