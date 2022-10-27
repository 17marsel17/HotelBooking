import { Reservation } from '../entity/reservation.entity';
import { Types } from 'mongoose';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ReservationDto {
  @IsString()
  @ApiProperty({ description: 'id пользователя' })
  user: string | Types.ObjectId;

  @IsString()
  @ApiProperty({ description: 'id гостиницы' })
  hotel: string | Types.ObjectId;

  @IsString()
  @ApiProperty({ description: 'id комнаты' })
  room: string | Types.ObjectId;

  @ApiProperty({ description: 'Дата начала бронирования' })
  @IsDate()
  @Type(() => Date)
  dateStart: Date;

  @ApiProperty({ description: 'Дата окончания бронирования' })
  @IsDate()
  @Type(() => Date)
  dateEnd: Date;
}

export class ReservationSearchOptions {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'id пользователя' })
  user?: string | Types.ObjectId;

  @ApiProperty({ description: 'Дата начала бронирования' })
  @IsDate()
  @Type(() => Date)
  dateStart?: Date;

  @ApiProperty({ description: 'Дата окончания бронирования' })
  @IsDate()
  @Type(() => Date)
  dateEnd?: Date;
}

export interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<Reservation | null>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
