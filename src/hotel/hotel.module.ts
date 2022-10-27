import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { HotelRoomService } from './hotel-room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './entity/hotel.entity';
import { HotelRoom, HotelRoomSchema } from './entity/hotel-room.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  providers: [HotelService, HotelRoomService],
  controllers: [HotelController],
  exports: [HotelService, HotelRoomService],
})
export class HotelModule {}
