import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsModule as DatabaseReviewsModule } from '../../database/reviews/reviews.module';
@Module({
  imports: [DatabaseReviewsModule],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
