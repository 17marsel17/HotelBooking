import { Injectable } from '@nestjs/common';
import {
  GetCharListParams,
  ISupportRequestService,
  SendMessageDto,
} from './interface/support.interface';
import { Message, SupportRequest } from './entity/support.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequestGateway } from './support.gateway';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SupportService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly gateway: SupportRequestGateway,
    private eventEmitter: EventEmitter2,
  ) {}

  findSupportRequest(
    params: GetCharListParams,
  ): Promise<SupportRequest[]> | null {
    const searchParams: FilterQuery<SupportRequest> = {};
    if (params) {
      if (params.user) {
        searchParams.user = params.user;
      }
      if (params.isActive) {
        searchParams.isActive = params.isActive;
      }

      return this.supportRequestModel
        .find(params)
        .limit(params.limit)
        .skip(params.offset)
        .exec();
    }

    return null;
  }

  async getMessages(
    supportRequest: string | Types.ObjectId,
  ): Promise<Message[] | null> {
    const response: SupportRequest | null = await this.supportRequestModel
      .findById(supportRequest)
      .exec();

    if (response) {
      return response.messages;
    }

    return null;
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const request = await this.supportRequestModel.findById(
      data.supportRequest,
    );

    const newMessage = await this.messageModel.create({
      author: data.author,
      sentAt: new Date(),
      text: data.text,
    });

    if (request) {
      request.messages.push(newMessage);

      this.eventEmitter.emit('new-message', { request, newMessage });
      return newMessage;
    }
    throw new Error();
  }

  @OnEvent('new-message')
  subscribe(handler: any): void {
    this.gateway.sendMessage(handler.request, handler.newMessage);
  }
}
