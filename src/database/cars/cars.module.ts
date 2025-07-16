import { Module } from '@nestjs/common';
import { carsProviders } from './cars.providers';
import { CarsService } from './cars.service';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...carsProviders, CarsService],
  exports: [CarsService],
})
export class CarsModule {}
