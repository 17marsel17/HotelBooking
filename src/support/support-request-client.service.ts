import {
  CreateSupportRequestDto,
  ISupportRequestClientService,
  MarkMessagesAsReadDto,
} from './interface/support.interface';
import { Message, SupportRequest } from './entity/support.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const newMessage = await this.messageModel.create({
      author: data.user,
      sentAt: new Date(),
      text: data.text,
    });

    return await this.supportRequestModel.create({
      user: data.user,
      createdAt: new Date(),
      messages: [newMessage],
      isActive: true,
    });
  }

  async getUnreadCount(
    supportRequest: string | Types.ObjectId,
  ): Promise<Message[] | undefined> {
    const response = await this.supportRequestModel
      .findById(supportRequest)
      .exec();

    return await response?.messages.filter(
      (message) =>
        message.readAt &&
        message.author.toString() === response?.user.toString(),
    );
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
    const supportRequest = await this.supportRequestModel
      .findById(params.supportRequest)
      .exec();

    if (!supportRequest) {
      throw new NotFoundException(
        `Запрос с ID ${params.supportRequest} не найден`,
      );
    }

    const messages = supportRequest.messages;

    for (const message of messages) {
      if (!message.readAt && message.author.toString() === params.user) {
        await this.messageModel.findByIdAndUpdate(message._id, {
          readAt: new Date(),
        });
      }
    }

    if (supportRequest?.user.toString() !== params.user.toString()) {
      throw new UnauthorizedException();
    }
  }
}
