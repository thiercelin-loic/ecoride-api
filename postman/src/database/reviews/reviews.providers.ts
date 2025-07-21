import { DataSource } from 'typeorm';
import { Review } from './reviews.entity';
export const reviewsProviders = [
  {
    provide: 'REVIEWS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Review),
    inject: ['DATA_SOURCE'],
  },
];
