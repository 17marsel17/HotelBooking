import { Types } from 'mongoose';
import { Message, SupportRequest } from '../entity/support.entity';
import { IsNumber, IsString, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSupportRequestDto {
  @IsString()
  @ApiProperty({ description: 'id пользователя' })
  user: string | Types.ObjectId;

  @IsString()
  @ApiProperty({ description: 'Текст сообщения' })
  text: string;
}

export interface SendMessageDto {
  author: string | Types.ObjectId;
  supportRequest: string | Types.ObjectId;
  text: string;
}

export class MarkMessagesAsReadDto {
  @ApiProperty({ description: 'id пользователя' })
  user: string | Types.ObjectId;

  @ApiProperty({ description: 'id запроса в техподдержку' })
  supportRequest: string | Types.ObjectId;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ description: 'Дата создания' })
  createdBefore: Date;
}

export interface GetCharListParams {
  user?: string | Types.ObjectId | null;
  isActive: boolean;
  limit: number;
  offset: number;
}

export interface SupportRequestParams {
  limit: number;
  offset: number;
}

export class SupportRequestParams {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'Количество записей в ответе' })
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'Сдвиг от начала списка' })
  offset: number;

  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({ description: 'Фильтр по полю isActive' })
  isActive: boolean;
}

export interface ISupportRequestService {
  findSupportRequest(
    params: GetCharListParams,
  ): Promise<SupportRequest[]> | null;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(
    supportRequest: string | Types.ObjectId,
  ): Promise<Message[] | null>;
  subscribe(handler: {
    supportRequest: SupportRequest;
    message: Message;
  }): void;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;

  // Выставляет текущую дату в поле readAt всем сообщениям, которые не были прочитаны и были отправлены не пользователем
  markMessagesAsRead(params: MarkMessagesAsReadDto): void;

  // Возвращает количество сообщений, которые были отправлены любым сотрудником поддержки и не отмечены прочитанными
  getUnreadCount(
    supportRequest: string | Types.ObjectId,
  ): Promise<Message[] | undefined>;
}

export interface ISupportRequestEmployeeService {
  // Выставляет текущую дату в поле readAt всем сообщениям, которые не были прочитаны и были отправлены пользователем
  markMessagesAsRead(params: MarkMessagesAsReadDto): void;

  // Возвращает количество сообщений, которые были отправлены пользователем и не отмечены прочитанными
  getUnreadCount(
    supportRequest: string | Types.ObjectId,
  ): Promise<Message[] | undefined>;
  // Меняет флаг isActive на false
  closeRequest(supportRequest: string | Types.ObjectId): Promise<void>;
}
