import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationSearchOptions } from './interface/reservation.interface';
import { RolesGuard } from '../common/role/roles.guard';
import { Roles } from '../common/role/roles.decorator';
import { Role } from '../common/role/role.enum';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { CreateReservationsDto } from './dto/create-reservations.dto';
import { HotelRoomService } from '../hotel/hotel-room.service';

@Controller('/api')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  // Создает бронь на выбранную дату для текущего пользователя
  @Post('/client/reservations')
  @Roles(Role.client)
  async createReservation(
    @Body() params: CreateReservationsDto,
    @Req() req: any,
  ) {
    try {
      const hotelRoom = await this.hotelRoomService.findById(params.hotelRoom);

      return await this.reservationService.addReservation({
        user: req.user._id,
        hotel: hotelRoom?.hotel || '',
        room: params.hotelRoom,
        dateStart: params.dateStart,
        dateEnd: params.dateEnd,
      });
    } catch {
      throw new NotFoundException(
        `Номер с id=${params.hotelRoom} не существует`,
      );
    }
  }

  // Список броней текущего пользователя
  @Get('/client/reservations')
  @Roles(Role.client)
  getReservations(@Query() params: ReservationSearchOptions, @Req() req: any) {
    return this.reservationService.getReservations({ user: req.user._id });
  }

  // Отменяет бронь пользователя
  @Delete('/client/reservations/:id')
  @Roles(Role.client)
  deleteReservation(@Param() params: any, @Req() req: any) {
    return this.reservationService.removeReservation(params.id, req.user._id);
  }

  // Список броней конкретного пользователя
  @Get('/manager/reservations/:userId')
  @Roles(Role.manager)
  async getReservationsByUserId(@Param() param: any) {
    const params: ReservationSearchOptions = {
      user: param.userId,
      // dateEnd: new Date(),
      // dateStart: new Date(),
    };

    return await this.reservationService.getReservations(params);
  }

  // Отменяет бронь пользователя
  @Delete('/manager/reservations/:userId/:reservationId')
  @Roles(Role.manager)
  async deleteReservationByManager(@Param() params: any) {
    return await this.reservationService.removeReservationByManager(
      params.reservationId,
      params.userId,
    );
  }
}
