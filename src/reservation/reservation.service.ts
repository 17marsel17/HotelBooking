import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IReservation,
  ReservationDto,
  ReservationSearchOptions,
} from './interface/reservation.interface';
import { Reservation } from './entity/reservation.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HotelRoomService } from '../hotel/hotel-room.service';

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    private readonly hotelRoomService: HotelRoomService,
  ) {}
  async addReservation(data: ReservationDto): Promise<Reservation> {
    const hotelRoom = await this.hotelRoomService.findById(data.room);

    if (!hotelRoom || !hotelRoom.isEnabled) {
      throw new BadRequestException(
        'Номер с указанным ID не существует или он отключен',
      );
    }
    return this.reservationModel.create({
      userId: data.user,
      hotelId: data.hotel,
      roomId: data.room,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
    });
  }

  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    return this.reservationModel.find(filter).exec();
  }

  async removeReservation(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<Reservation | null> {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new BadRequestException('Бронь с указанным ID не существует');
    }

    if (userId !== reservation.userId) {
      throw new ForbiddenException(
        'ID текущего пользователя не совпадает с ID пользователя в брони',
      );
    }

    return this.reservationModel.findByIdAndDelete(id).exec();
  }

  async removeReservationByManager(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<Reservation | null> {
    const reservation = await this.reservationModel.find({
      _id: id,
      userId: userId,
    });

    if (!reservation.length) {
      throw new NotFoundException(
        'Бронь для пользователя с указанным ID не существует',
      );
    }

    return this.reservationModel
      .findOneAndDelete({ _id: id, userId: userId })
      .exec();
  }
}
