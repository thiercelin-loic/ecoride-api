import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Brand } from '../brand/brand.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  make: string;

  @Column({ length: 100 })
  model: string;

  @Column()
  year: number;

  @Column({ length: 20, unique: true })
  licensePlate: string;

  @Column()
  capacity: number;

  @Column({
    type: 'enum',
    enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'hydrogen'],
    default: 'gasoline',
  })
  fuelType: string;

  @Column({
    type: 'enum',
    enum: ['available', 'in_use', 'maintenance', 'inactive'],
    default: 'available',
  })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: ['Electric', 'Hybrid', 'Gasoline', 'Diesel'],
    default: 'Gasoline',
  })
  energy: 'Electric' | 'Hybrid' | 'Gasoline' | 'Diesel';

  @Column({ type: 'varchar', length: 50 })
  color: string;

  @Column({ nullable: true })
  brandId: number;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;
}
