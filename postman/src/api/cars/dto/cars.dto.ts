import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, Length } from 'class-validator';
export class CreateCarDto {
  @ApiProperty({
    description: 'Car model name',
    example: 'Tesla Model 3',
  })
  @IsString()
  @Length(2, 100)
  model: string;
  @ApiProperty({
    description: 'Car license plate number',
    example: 'AB-123-CD',
  })
  @IsString()
  @Length(2, 50)
  immatriculation: string;
  @ApiProperty({
    description: 'Car energy/fuel type',
    example: 'Electric',
    enum: ['Electric', 'Hybrid', 'Gasoline', 'Diesel'],
  })
  @IsString()
  energy: string;
  @ApiProperty({
    description: 'Car color',
    example: 'Blue',
  })
  @IsString()
  color: string;
  @ApiProperty({
    description: 'Car release date',
    example: '2023-01-15',
  })
  @IsDateString()
  dateOfRelease: Date;
}
export class UpdateCarDto {
  @ApiPropertyOptional({
    description: 'Car model name',
    example: 'Tesla Model Y',
  })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  model?: string;
  @ApiPropertyOptional({
    description: 'Car license plate number',
    example: 'XY-789-ZW',
  })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  immatriculation?: string;
  @ApiPropertyOptional({
    description: 'Car energy/fuel type',
    example: 'Hybrid',
    enum: ['Electric', 'Hybrid', 'Gasoline', 'Diesel'],
  })
  @IsString()
  @IsOptional()
  energy?: string;
  @ApiPropertyOptional({
    description: 'Car color',
    example: 'Red',
  })
  @IsString()
  @IsOptional()
  color?: string;
  @ApiPropertyOptional({
    description: 'Car release date',
    example: '2023-06-30',
  })
  @IsDateString()
  @IsOptional()
  dateOfRelease?: Date;
}
