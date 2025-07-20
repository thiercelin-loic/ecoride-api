import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { TripSearchService } from './trip-search.service';
import { SearchController } from './search.controller';
import { UsersModule } from '../../database/users/users.module';
import { CarsModule } from '../../database/cars/cars.module';
import { CodrivingModule } from '../../database/codriving/codriving.module';
@Module({
  imports: [UsersModule, CarsModule, CodrivingModule],
  controllers: [SearchController],
  providers: [SearchService, TripSearchService],
})
export class SearchModule {}
