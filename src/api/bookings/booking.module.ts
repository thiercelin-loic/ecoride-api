import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingModule as BookingDatabaseModule } from '../../database/bookings/booking.module';
@Module({
  imports: [BookingDatabaseModule],
  controllers: [BookingController],
})
export class BookingModule {}
