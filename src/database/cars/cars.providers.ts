import { DataSource } from 'typeorm';
import { Car } from './cars.entity';
export const carsProviders = [
  {
    provide: 'CARS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Car),
    inject: ['DATA_SOURCE'],
  },
];
