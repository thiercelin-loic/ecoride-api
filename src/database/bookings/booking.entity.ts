import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}
@Entity('bookings')
export class Booking {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiPropertyOptional({ description: 'Passenger user' })
  @ManyToOne('User')
  @JoinColumn({ name: 'passengerId' })
  passenger: import('../users/users.entity').User;
  @Column({ name: 'passengerId' })
  passengerId: number;
  @ApiPropertyOptional({ description: 'Codriving trip' })
  @ManyToOne('Codriving')
  @JoinColumn({ name: 'codrivingId' })
  codriving: import('../codriving/codriving.entity').Codriving;
  @Column({ name: 'codrivingId' })
  codrivingId: number;
  @ApiProperty({
    description: 'Booking status',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;
  @ApiProperty({ description: 'Credits used for this booking', example: 5 })
  @Column({ type: 'int' })
  creditsUsed: number;
  @ApiPropertyOptional({ description: 'Booking notes from passenger' })
  @Column({ type: 'text', nullable: true })
  notes: string;
  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;
  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
