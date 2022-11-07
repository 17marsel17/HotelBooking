import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupportService } from './support.service';
import {
  GetCharListParams,
  MarkMessagesAsReadDto,
  SendMessageDto,
  SupportRequestParams,
} from './interface/support.interface';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { RolesGuard } from '../common/role/roles.guard';
import { Roles } from '../common/role/roles.decorator';
import { Role } from '../common/role/role.enum';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';

@Controller()
@UseGuards(AuthenticatedGuard, RolesGuard)
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly supportServiceClient: SupportRequestClientService,
    private readonly supportServiceEmployee: SupportRequestEmployeeService,
  ) {}

  // Позволяет пользователю с ролью client создать обращение в техподдержку
  @Roles(Role.client)
  @Post('/client/support-requests')
  createSupportRequest(@Body() messageDto: CreateMessageDto, @Req() req: any) {
    return this.supportServiceClient.createSupportRequest({
      user: req.user._id,
      text: messageDto.text,
    });
  }

  // Позволяет пользователю с ролью client получить список обращений для текущего пользователя
  @Roles(Role.client)
  @Get('/client/support-requests')
  getSupportRequest(@Query() params: SupportRequestParams, @Req() req: any) {
    const searchParams: GetCharListParams = {
      user: req.user,
      isActive: params.isActive,
      limit: params.limit,
      offset: params.offset,
    };
    return this.supportService.findSupportRequest(searchParams);
  }

  // Позволяет пользователю с ролью manager получить список обращений от клиентов
  @Roles(Role.manager)
  @Get('/manager/support-requests')
  getSupportRequestByManager(@Query() params: SupportRequestParams) {
    return this.supportService.findSupportRequest(params);
  }

  // Позволяет пользователю с ролью manager или client получить все сообщения из чата
  @Roles(Role.manager, Role.client)
  @Get('/common/support-requests/:id/messages')
  getSupportRequestMessagesById(@Param() params: { id: string }) {
    return this.supportService.getMessages(params.id);
  }

  // Позволяет пользователю с ролью manager или client отправлять сообщения в чат
  @Roles(Role.manager, Role.client)
  @Post('/common/support-requests/:id/messages')
  sendMessages(
    @Param() param: { id: string },
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: any,
  ) {
    const params: SendMessageDto = {
      author: req.user._id,
      text: createMessageDto.text,
      supportRequest: param.id,
    };
    return this.supportService.sendMessage(params);
  }

  // Позволяет пользователю с ролью manager или client отправлять отметку, что сообщения прочитаны
  @Roles(Role.manager, Role.client)
  @Post('/common/support-requests/:id/messages/read')
  markMessagesIsRead(
    @Param() params: { id: string },
    @Body() markMessagesReadDto: MarkMessagesAsReadDto,
    @Req() req: any,
  ) {
    console.log(req.user.role);
    markMessagesReadDto.user = req.user._id;
    markMessagesReadDto.supportRequest = params.id;
    if (req.user.role === Role.manager) {
      return this.supportServiceEmployee.markMessagesAsRead(
        markMessagesReadDto,
      );
    } else if (req.user.role === Role.client) {
      return this.supportServiceClient.markMessagesAsRead(markMessagesReadDto);
    }
  }
}
