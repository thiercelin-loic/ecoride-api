import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { bookingProviders } from './booking.providers';
import { DatabaseModule } from '../database.module';
import { UsersModule } from '../users/users.module';
import { CodrivingModule } from '../codriving/codriving.module';
@Module({
  imports: [DatabaseModule, UsersModule, CodrivingModule],
  providers: [...bookingProviders, BookingService],
  exports: [BookingService],
})
export class BookingModule {}
