import { Module } from '@nestjs/common';
import { reviewsProviders } from './reviews.providers';
import { ReviewsService } from './reviews.service';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...reviewsProviders, ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
