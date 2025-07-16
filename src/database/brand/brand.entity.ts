import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('brands')
export class Brand {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'Brand name', example: 'Tesla' })
  @Column({ type: 'varchar', length: 50 })
  name: string;
  @ApiProperty({ description: 'Brand tag', example: 'Electric cars' })
  @Column({ type: 'varchar', length: 50 })
  tag: string;
}
