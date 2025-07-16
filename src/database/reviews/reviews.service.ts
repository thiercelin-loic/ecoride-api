import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
export interface CreateReviewDto {
  commentary: string;
  rate: string;
  status: string;
}
export interface UpdateReviewDto {
  commentary?: string;
  rate?: string;
  status?: string;
}
@Injectable()
export class ReviewsService {
  constructor(
    @Inject('REVIEWS_REPOSITORY')
    private reviewsRepository: Repository<Review>,
  ) {}
  async findAll(): Promise<Review[]> {
    return this.reviewsRepository.find();
  }
  async findById(id: number): Promise<Review | null> {
    return this.reviewsRepository.findOne({ where: { id } });
  }
  async findByStatus(status: string): Promise<Review[]> {
    return this.reviewsRepository.find({ where: { status } });
  }
  async findByRate(rate: string): Promise<Review[]> {
    return this.reviewsRepository.find({ where: { rate } });
  }
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewsRepository.create(createReviewDto);
    return this.reviewsRepository.save(review);
  }
  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review | null> {
    await this.reviewsRepository.update(id, updateReviewDto);
    return this.findById(id);
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.reviewsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
