import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ReviewsService,
  CreateReviewDto,
  UpdateReviewDto,
} from '../../database/reviews/reviews.service';
import { Review } from '../../database/reviews/reviews.entity';
@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get()
  async findAll(@Query('status') status?: string): Promise<Review[]> {
    if (status) {
      return this.reviewsService.findByStatus(status);
    }
    return this.reviewsService.findAll();
  }
  @Get('rate/:rate')
  async findByRate(@Param('rate') rate: string): Promise<Review[]> {
    return this.reviewsService.findByRate(rate);
  }
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Review> {
    const review = await this.reviewsService.findById(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createReviewDto);
  }
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewsService.update(id, updateReviewDto);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const deleted = await this.reviewsService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return { message: 'Review deleted successfully' };
  }
}
