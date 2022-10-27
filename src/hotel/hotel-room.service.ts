import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IHotelRoomService,
  SearchRoomsParams,
} from './interface/hotel.interface';
import { HotelRoom, HotelRoomDocument } from './entity/hotel-room.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    return this.hotelRoomModel.create({
      hotel: data.hotel,
      description: data.description,
      images: data.images,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEnabled: true,
    });
  }

  async findById(
    id: string | Types.ObjectId,
    isEnabled?: true,
  ): Promise<HotelRoom | null> {
    return await this.hotelRoomModel.findById(id).exec();
  }

  search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    const searchParams: FilterQuery<HotelRoomDocument> = {};

    if (params) {
      const { title, isEnabled, hotel } = params;

      // title это ID?
      if (title) {
        searchParams.title = { $regex: title, $options: 'i' };
      }

      if (isEnabled) {
        searchParams.isEnabled = true;
      }

      if (hotel) {
        searchParams.hotel = hotel;
      }
    }

    return this.hotelRoomModel
      .find(searchParams)
      .limit(+params.limit)
      .skip(+params.offset)
      .exec();
  }

  //
  async update(
    id: string | Types.ObjectId,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom | null> {
    const hotelRoom = await this.hotelRoomModel
      .findByIdAndUpdate({ _id: id }, { ...data, updatedAt: new Date() })
      .exec();

    if (hotelRoom) {
      return await this.hotelRoomModel.findById({ _id: id }).exec();
    } else {
      throw new NotFoundException(`Номер с id=${id} не найден`);
    }
  }
}
