import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
export enum TripStatus {
  AVAILABLE = 'available',
  FULL = 'full',
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
@Entity('codriving')
export class Codriving {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'Departure date', example: '2025-07-20' })
  @Column({ type: 'date' })
  departureDate: Date;
  @ApiProperty({ description: 'Departure time', example: '14:00' })
  @Column({ type: 'time' })
  departureHour: string;
  @ApiProperty({ description: 'Departure location', example: 'Paris' })
  @Column({ type: 'varchar', length: 100 })
  departureLocation: string;
  @ApiProperty({ description: 'Departure city for search', example: 'Paris' })
  @Column({ type: 'varchar', length: 50 })
  departureCity: string;
  @ApiProperty({ description: 'Arrival date', example: '2025-07-20' })
  @Column({ type: 'date' })
  arrivalDate: Date;
  @ApiProperty({ description: 'Arrival time', example: '16:00' })
  @Column({ type: 'time' })
  arrivalHour: string;
  @ApiProperty({ description: 'Arrival location', example: 'Lyon' })
  @Column({ type: 'varchar', length: 100 })
  arrivalLocation: string;
  @ApiProperty({ description: 'Arrival city for search', example: 'Lyon' })
  @Column({ type: 'varchar', length: 50 })
  arrivalCity: string;
  @ApiProperty({
    description: 'Trip status',
    enum: TripStatus,
    default: TripStatus.AVAILABLE,
  })
  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.AVAILABLE })
  status: TripStatus;
  @ApiProperty({ description: 'Available seats', example: 3 })
  @Column({ type: 'int' })
  seatsAvailable: number;
  @ApiProperty({ description: 'Price per seat', example: 25.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @ApiProperty({ description: 'Trip duration in minutes', example: 120 })
  @Column({ type: 'int', nullable: true })
  durationMinutes: number;
  @ApiProperty({ description: 'Trip driver' })
  @ManyToOne('User')
  @JoinColumn({ name: 'driverId' })
  driver: import('../users/users.entity').User;
  @Column({ name: 'driverId' })
  driverId: number;
  @ApiProperty({ description: 'Car used for this trip' })
  @ManyToOne('Car')
  @JoinColumn({ name: 'carId' })
  car: {
    color: string;
    model: string;
    id: number;
    energy: string;
  };
  @Column({ name: 'carId', nullable: true })
  carId: number;
  @ApiProperty({ description: 'Trip bookings' })
  @OneToMany('Booking', 'codriving')
  bookings: import('../bookings/booking.entity').Booking[];
  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;
  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
  get isEcological(): boolean {
    return this.car?.energy === 'Electric';
  }
  get departureDateTime(): Date {
    const [hours, minutes] = this.departureHour.split(':');
    const dateTime = new Date(this.departureDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return dateTime;
  }
  get arrivalDateTime(): Date {
    const [hours, minutes] = this.arrivalHour.split(':');
    const dateTime = new Date(this.arrivalDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return dateTime;
  }
}
