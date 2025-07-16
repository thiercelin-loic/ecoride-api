import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './database/configuration/configuration.module';
import { SearchModule } from './api/search/search.module';
import { UsersModule } from './api/users/users.module';
import { ReviewsModule } from './api/reviews/reviews.module';
import { CarsModule } from './api/cars/cars.module';
import { CodrivingModule } from './api/codriving/codriving.module';
import { BookingModule } from './api/bookings/booking.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ConfigurationModule,
    SearchModule,
    UsersModule,
    ReviewsModule,
    CarsModule,
    CodrivingModule,
    BookingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
