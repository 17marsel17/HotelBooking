import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Message,
  MessageSchema,
  SupportRequest,
  SupportRequestSchema,
} from './entity/support.entity';
import { SupportRequestGateway } from './support.gateway';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    SupportService,
    SupportRequestGateway,
    SupportRequestEmployeeService,
    SupportRequestClientService,
  ],
  controllers: [SupportController],
  exports: [SupportService],
})
export class SupportModule {}
