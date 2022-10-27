import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import {
  SearchHotelParams,
  SearchRoomsParams,
} from './interface/hotel.interface';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { HotelRoomService } from './hotel-room.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { diskStorage } from 'multer';
import { filenameFilter } from '../common/multer.config';
import { RolesGuard } from '../common/role/roles.guard';
import { Roles } from '../common/role/roles.decorator';
import { Role } from '../common/role/role.enum';

@Controller('/api')
@UseGuards(RolesGuard)
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelRoomsService: HotelRoomService,
  ) {}

  // Основной API для поиска номеров
  @Get('/common/hotel-rooms')
  findHotelRooms(@Query() params: SearchRoomsParams) {
    return this.hotelRoomsService.search(params);
  }

  // Получение подробной информации о номере
  @Get('/common/hotel-rooms/:id')
  async findHotelRoomById(@Param() params: any) {
    try {
      return await this.hotelRoomsService.findById(params.id);
    } catch {
      throw new NotFoundException(`Номер с id=${params.id} не найден`);
    }
  }

  // Добавление гостиницы администратором
  @UseGuards(AuthenticatedGuard)
  @Post('/admin/hotels')
  @Roles(Role.admin)
  addHotel(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.create(createHotelDto);
  }

  // Получение списка гостиниц администратором
  @UseGuards(AuthenticatedGuard)
  @Get('/admin/hotels')
  @Roles(Role.admin)
  getHotels(@Query() params: SearchHotelParams) {
    return this.hotelService.search(params);
  }

  // Изменение описания гостиницы администратором
  @UseGuards(AuthenticatedGuard)
  @Put('/admin/hotels/:id')
  @Roles(Role.admin)
  async updateHotel(
    @Param() params: any,
    @Body() createHotelDto: CreateHotelDto,
  ) {
    return await this.hotelService.update(params.id, createHotelDto);
  }

  // Добавление номера гостиницы администратором
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FilesInterceptor('images', 2, {
      storage: diskStorage({
        destination: './images/room',
        filename: filenameFilter,
      }),
    }),
  )
  @Post('/admin/hotel-rooms')
  @Roles(Role.admin)
  addHotelRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createHotelRoomDto: CreateHotelRoomDto,
  ) {
    let imagesPath: Array<string> = new Array<string>();

    if (images) {
      images.forEach((el) => imagesPath.push(el.path));
    }

    const data = {
      hotel: createHotelRoomDto.hotelId,
      description: createHotelRoomDto.description,
      title: createHotelRoomDto.title,
      images: imagesPath,
    };

    return this.hotelRoomsService.create(data);
  }

  // Изменение описания гостиницы администратором
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FilesInterceptor('images', 2, {
      storage: diskStorage({
        destination: ',/images/room',
        filename: filenameFilter,
      }),
    }),
  )
  @Put('/admin/hotel-rooms/:id')
  @Roles(Role.admin)
  async updateHotelRoom(
    @Param() params: any,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createHotelRoomDto: CreateHotelRoomDto,
  ) {
    let imagesPath: Array<string> = new Array<string>();

    if (images) {
      images.forEach((el) => imagesPath.push(el.path));
    }

    const data = {
      hotel: createHotelRoomDto.hotelId,
      description: createHotelRoomDto.description,
      title: createHotelRoomDto.title,
      images: imagesPath,
    };

    return await this.hotelRoomsService.update(params.id, data);
  }
}
