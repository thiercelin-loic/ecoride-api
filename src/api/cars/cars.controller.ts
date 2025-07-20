import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  ConflictException,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CarsService } from '../../database/cars/cars.service';
import { Car } from '../../database/cars/cars.entity';
import { CreateCarDto, UpdateCarDto } from './dto/cars.dto';
import { UpdateCarDto as ServiceUpdateCarDto } from '../../database/cars/cars.service';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cars with optional filtering' })
  @ApiQuery({
    name: 'model',
    required: false,
    description: 'Filter by car model',
  })
  @ApiQuery({
    name: 'energy',
    required: false,
    description: 'Filter by energy type',
  })
  @ApiQuery({
    name: 'color',
    required: false,
    description: 'Filter by car color',
  })
  @ApiResponse({ status: 200, description: 'List of cars', type: [Car] })
  async findAll(
    @Query('model') model?: string,
    @Query('energy') energy?: string,
    @Query('color') color?: string,
  ): Promise<Car[]> {
    const validEnergyTypes = [
      'Electric',
      'Hybrid',
      'Gasoline',
      'Diesel',
    ] as const;
    type ValidEnergyType = (typeof validEnergyTypes)[number];

    if (energy) {
      if (validEnergyTypes.includes(energy as ValidEnergyType)) {
        return this.carsService.findByEnergy(energy as ValidEnergyType);
      } else {
        throw new BadRequestException(
          `Invalid energy type. Must be one of: ${validEnergyTypes.join(', ')}`,
        );
      }
    }

    if (model) {
      return this.carsService.findByModel(model);
    }

    if (color) {
      return this.carsService.findByColor(color);
    }

    return this.carsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Car> {
    const car = await this.carsService.findById(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  @Post()
  async create(@Body() createCarDto: CreateCarDto): Promise<Car> {
    const existingCar = await this.carsService.findByImmatriculation(
      createCarDto.immatriculation,
    );
    if (existingCar) {
      throw new ConflictException(
        'Car with this immatriculation already exists',
      );
    }

    // Validate energy type
    const validEnergyTypes = [
      'Electric',
      'Hybrid',
      'Gasoline',
      'Diesel',
    ] as const;

    if (
      createCarDto.energy &&
      !validEnergyTypes.some((type) => type === createCarDto.energy)
    ) {
      throw new BadRequestException(
        `Invalid energy type. Must be one of: ${validEnergyTypes.join(', ')}`,
      );
    }

    // After validation, we can safely assert the type
    return this.carsService.create({
      ...createCarDto,
      energy: createCarDto.energy as
        | 'Electric'
        | 'Hybrid'
        | 'Gasoline'
        | 'Diesel',
    });
  }
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Car> {
    // Validate energy type if provided
    if (updateCarDto.energy) {
      const validEnergyTypes = [
        'Electric',
        'Hybrid',
        'Gasoline',
        'Diesel',
      ] as const;

      if (!validEnergyTypes.some((type) => type === updateCarDto.energy)) {
        throw new BadRequestException(
          `Invalid energy type. Must be one of: ${validEnergyTypes.join(', ')}`,
        );
      }
    }

    // Create a service-compatible object with properly typed energy field
    const serviceUpdateDto = {
      ...updateCarDto,
      ...(updateCarDto.energy && {
        energy: updateCarDto.energy as
          | 'Electric'
          | 'Hybrid'
          | 'Gasoline'
          | 'Diesel',
      }),
    } as ServiceUpdateCarDto;

    const car = await this.carsService.update(id, serviceUpdateDto);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const deleted = await this.carsService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return { message: 'Car deleted successfully' };
  }
}
