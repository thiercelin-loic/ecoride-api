import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('reviews')
export class Review {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({
    description: 'Review commentary',
    example: 'Great experience!',
  })
  @Column({ type: 'varchar', length: 50 })
  commentary: string;
  @ApiProperty({ description: 'Rating given', example: '5' })
  @Column({ type: 'varchar', length: 50 })
  rate: string;
  @ApiProperty({
    description: 'Review status',
    example: 'published',
    enum: ['draft', 'published', 'rejected'],
  })
  @Column({ type: 'varchar', length: 50 })
  status: string;
}
