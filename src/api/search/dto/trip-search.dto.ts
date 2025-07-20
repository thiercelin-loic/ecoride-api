import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class TripSearchDto {
  @ApiProperty({
    description: 'Departure city',
    example: 'Paris',
  })
  @IsString()
  departureCity: string;
  @ApiProperty({
    description: 'Arrival city',
    example: 'Lyon',
  })
  @IsString()
  arrivalCity: string;
  @ApiProperty({
    description: 'Departure date',
    example: '2025-07-20',
  })
  @IsDateString()
  departureDate: string;
  @ApiPropertyOptional({
    description: 'Maximum price per seat',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
  @ApiPropertyOptional({
    description: 'Maximum trip duration in minutes',
    example: 180,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDuration?: number;
  @ApiPropertyOptional({
    description: 'Minimum driver rating',
    example: 4,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  minDriverRating?: number;
  @ApiPropertyOptional({
    description: 'Only ecological trips (electric cars)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  ecologicalOnly?: boolean;
  @ApiPropertyOptional({
    description: 'Minimum seats available',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minSeats?: number;
}
export class TripSearchResultDto {
  @ApiProperty({ description: 'Trip ID' })
  id: number;
  @ApiProperty({ description: 'Departure city' })
  departureCity: string;
  @ApiProperty({ description: 'Arrival city' })
  arrivalCity: string;
  @ApiProperty({ description: 'Departure date and time' })
  departureDateTime: Date;
  @ApiProperty({ description: 'Arrival date and time' })
  arrivalDateTime: Date;
  @ApiProperty({ description: 'Price per seat' })
  price: number;
  @ApiProperty({ description: 'Available seats' })
  seatsAvailable: number;
  @ApiProperty({ description: 'Is ecological trip' })
  isEcological: boolean;
  @ApiProperty({ description: 'Trip duration in minutes' })
  durationMinutes: number;
  @ApiProperty({ description: 'Driver information' })
  driver: {
    id: number;
    pseudo: string;
    picture_profil?: Buffer;
    rating?: number;
  };
  @ApiProperty({ description: 'Car information' })
  car: {
    id: number;
    model: string;
    energy: string;
    color: string;
  };
}
