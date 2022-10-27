import { Injectable, NotFoundException } from '@nestjs/common';
import { IHotelService, SearchHotelParams } from './interface/hotel.interface';
import { Hotel, HotelDocument } from './entity/hotel.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(data: any): Promise<Hotel> {
    return await this.hotelModel.create({
      title: data.title,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findById(id: string | Types.ObjectId): Promise<Hotel | null> {
    return this.hotelModel.findById(id).exec();
  }

  search(params: SearchHotelParams): Promise<Hotel[]> {
    return this.hotelModel
      .find()
      .limit(params.limit)
      .skip(params.offset)
      .exec();
  }

  async update(id: string | Types.ObjectId, data: any): Promise<Hotel | null> {
    const hotel = await this.hotelModel
      .findByIdAndUpdate({ _id: id }, { ...data, updatedAt: new Date() })
      .exec();

    if (hotel) {
      return await this.hotelModel.findById({ _id: id }).exec();
    } else {
      throw new NotFoundException(`Гостиница с id=${id} не найдена`);
    }
  }
}
