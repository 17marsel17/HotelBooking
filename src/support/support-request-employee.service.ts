import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
} from './interface/support.interface';
import { Model, Types } from 'mongoose';
import { Message, SupportRequest } from './entity/support.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async closeRequest(supportRequest: string | Types.ObjectId): Promise<void> {
    await this.supportRequestModel
      .findByIdAndUpdate(supportRequest, {
        isActive: false,
      })
      .exec();
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

    if (supportRequest?.user.toString() !== params.user.toString()) {
      throw new UnauthorizedException();
    }

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
  }
}
