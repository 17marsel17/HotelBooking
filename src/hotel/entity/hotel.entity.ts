import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export type HotelDocument = Hotel;

@Schema()
export class Hotel {
  @ApiProperty({ description: 'Название' })
  @Prop({ required: true })
  title: Types.ObjectId;

  @ApiProperty({ description: 'Описание' })
  @Prop()
  description: string;

  @ApiProperty({ description: 'Дата создания' })
  @Prop({ required: true })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @Prop({ required: true })
  updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
