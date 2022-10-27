import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from '../../user/entity/user.entity';
import { Hotel } from '../../hotel/entity/hotel.entity';
import { HotelRoom } from '../../hotel/entity/hotel-room.entity';

export type ReservationDocument = Reservation;

@Schema()
export class Reservation {
  @ApiProperty({ description: 'id пользователя' })
  @Prop({ ref: User.name, required: true })
  userId: Types.ObjectId;

  @ApiProperty({ description: 'id отеля' })
  @Prop({ ref: Hotel.name, required: true })
  hotelId: Types.ObjectId;

  @ApiProperty({ description: 'id комнаты' })
  @Prop({ ref: HotelRoom.name, required: true })
  roomId: Types.ObjectId;

  @ApiProperty({ description: 'Дата начала бронирования' })
  @Prop({ required: true })
  dateStart: Date;

  @ApiProperty({ description: 'Дата окончания бронирования' })
  @Prop({ required: true })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
