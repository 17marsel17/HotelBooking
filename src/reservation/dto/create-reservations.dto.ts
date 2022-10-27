import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReservationsDto {
  @IsString()
  @ApiProperty({ description: 'id комнаты' })
  hotelRoom: string;

  @ApiProperty({ description: 'Дата начала бронирования' })
  @IsDate()
  @Type(() => Date)
  dateStart: Date;

  @ApiProperty({ description: 'Дата окончания бронирования' })
  @IsDate()
  @Type(() => Date)
  dateEnd: Date;
}
