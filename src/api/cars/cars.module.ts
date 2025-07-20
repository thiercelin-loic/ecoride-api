import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsModule as DatabaseCarsModule } from '../../database/cars/cars.module';
@Module({
  imports: [DatabaseCarsModule],
  controllers: [CarsController],
})
export class CarsModule {}
