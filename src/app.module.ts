import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URL } from './config';
import { AuthModule } from './auth/auth.module';
import { HotelModule } from './hotel/hotel.module';
import { ReservationModule } from './reservation/reservation.module';
import { SupportModule } from './support/support.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URL),
    AuthModule,
    HotelModule,
    ReservationModule,
    SupportModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
