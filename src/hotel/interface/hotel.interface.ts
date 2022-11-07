import { Hotel } from '../entity/hotel.entity';
import { HotelRoom } from '../entity/hotel-room.entity';
import { Types } from 'mongoose';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: string | Types.ObjectId): Promise<Hotel | null>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
}

export class SearchRoomsParams {
  @ApiProperty({ description: 'Количество записей в ответе' })
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  limit: number;

  @ApiProperty({ description: 'Сдвиг от начала списка' })
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  offset: number;

  @ApiProperty({ description: 'Название гостиницы' })
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty({ description: 'Флаг доступности номера' })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsDefined()
  @ApiProperty({ description: 'ID гостиницы для фильтра' })
  hotel: Types.ObjectId | string;
}

export class SearchHotelParams {
  @ApiProperty({ description: 'Количество записей в ответе' })
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  limit: number;

  @ApiProperty({ description: 'Сдвиг от начала списка' })
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  offset: number;
}

export interface IHotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(
    id: string | Types.ObjectId,
    isEnabled?: true,
  ): Promise<HotelRoom | null | undefined>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(
    id: string | Types.ObjectId,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom | null>;
}
