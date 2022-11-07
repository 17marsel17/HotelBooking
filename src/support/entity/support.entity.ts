import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from '../../user/entity/user.entity';

@Schema()
export class SupportRequest {
  _id?: string;

  @ApiProperty({ description: 'Пользователь' })
  @Prop({ ref: User.name, required: true })
  user: Types.ObjectId;

  @ApiProperty({ description: 'Дата создания' })
  @Prop({ required: true })
  createdAt: Date;

  @ApiProperty({ description: 'Сообщения' })
  @Prop()
  messages: Message[];

  @ApiProperty({ description: 'isActive' })
  @Prop()
  isActive: boolean;
}

@Schema()
export class Message {
  _id?: string;

  @ApiProperty({ description: 'id автора' })
  @Prop({ ref: User.name, required: true })
  author: Types.ObjectId;

  @ApiProperty({ description: 'Дата создания' })
  @Prop({ required: true })
  sentAt: Date;

  @ApiProperty({ description: 'Текст сообщения' })
  @Prop({ required: true })
  text: string;

  @ApiProperty({ description: 'Дата прочтения' })
  @Prop()
  readAt: Date;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
export const MessageSchema = SchemaFactory.createForClass(Message);
