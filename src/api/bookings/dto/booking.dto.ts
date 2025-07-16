import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  Min,
} from 'class-validator';
import { BookingStatus } from '../../../database/bookings/booking.entity';
export class CreateBookingDto {
  @ApiProperty({
    description: 'ID of the codriving trip to book',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  codrivingId: number;
  @ApiProperty({
    description: 'Number of credits to use for this booking',
    example: 5,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  creditsUsed: number;
  @ApiPropertyOptional({
    description: 'Additional notes from the passenger',
    example: 'I will be carrying a small bag',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiPropertyOptional({
    description: 'Updated booking status',
    enum: BookingStatus,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
