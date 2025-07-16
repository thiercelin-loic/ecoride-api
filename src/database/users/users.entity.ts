import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserPreferences } from '../../types/user.types';
import { Car } from '../cars/cars.entity';
export enum UserRole {
  VISITOR = 'visitor',
  USER = 'user',
  EMPLOYEE = 'employee',
  ADMINISTRATOR = 'administrator',
}
export enum UserType {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  BOTH = 'both',
}
@Entity('users')
export class User {
  @ApiProperty({ description: 'User unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'User last name', maxLength: 100 })
  @Column({ type: 'varchar', length: 100 })
  lastname: string;
  @ApiProperty({ description: 'User first name', maxLength: 100 })
  @Column({ type: 'varchar', length: 100 })
  firstname: string;
  @ApiProperty({ description: 'User email address', maxLength: 150 })
  @Column({ type: 'varchar', length: 150, unique: true })
  mail: string;
  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;
  @ApiPropertyOptional({ description: 'User phone number', maxLength: 20 })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;
  @ApiPropertyOptional({ description: 'User address', maxLength: 255 })
  @Column({ type: 'varchar', length: 255, nullable: true })
  adress: string;
  @ApiPropertyOptional({ description: 'User birthday' })
  @Column({ type: 'date', nullable: true })
  birthday: Date;
  @ApiPropertyOptional({ description: 'User profile picture' })
  @Column({ type: 'blob', nullable: true })
  picture_profil: Buffer;
  @ApiProperty({ description: 'User pseudo/username', maxLength: 100 })
  @Column({ type: 'varchar', length: 100, unique: true })
  pseudo: string;
  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
  @ApiPropertyOptional({
    description: 'User type (driver/passenger/both)',
    enum: UserType,
  })
  @Column({ type: 'enum', enum: UserType, nullable: true })
  userType: UserType;
  @ApiProperty({ description: 'User credit balance', default: 20 })
  @Column({ type: 'int', default: 20 })
  credits: number;
  @ApiProperty({ description: 'User account status' })
  @ApiPropertyOptional({ description: 'User preferences for driving' })
  @Column({ type: 'json', nullable: true })
  preferences: UserPreferences | null;

  @ApiPropertyOptional({ description: 'User owned cars' })
  @OneToMany('Car', 'owner')
  cars: Car[];

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;
  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
