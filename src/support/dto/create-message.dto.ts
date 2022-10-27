import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'Текст сообщения' })
  @IsString()
  @IsDefined()
  text: string;
}
