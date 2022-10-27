import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Hotel } from './hotel.entity';

export type HotelRoomDocument = HotelRoom;

@Schema()
export class HotelRoom {
  @ApiProperty({ description: 'HotelId' })
  @Prop({ type: Types.ObjectId, ref: Hotel.name, required: true })
  hotel: Types.ObjectId | string;

  @ApiProperty({ description: 'Описание' })
  @Prop()
  description: string;

  @ApiProperty({ description: 'Изображения' })
  @Prop({ default: [] })
  images: string[];

  @ApiProperty({ description: 'Дата создания' })
  @Prop({ required: true })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @Prop({ required: true })
  updatedAt: Date;

  @ApiProperty({ description: 'Доступность' })
  @Prop({ required: true, default: true })
  isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
