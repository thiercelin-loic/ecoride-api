import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CodrivingService,
  CreateCodrivingDto,
  UpdateCodrivingDto,
} from '../../database/codriving/codriving.service';
import {
  Codriving,
  TripStatus,
} from '../../database/codriving/codriving.entity';
@ApiTags('codriving')
@Controller('codriving')
export class CodrivingController {
  constructor(private readonly codrivingService: CodrivingService) {}
  @Get()
  async findAll(
    @Query('statut') statut?: TripStatus,
    @Query('departureLocation') departureLocation?: string,
    @Query('arrivalLocation') arrivalLocation?: string,
    @Query('minSeats') minSeats?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Promise<Codriving[]> {
    if (statut) {
      return this.codrivingService.findByStatus(statut);
    }
    if (departureLocation) {
      return this.codrivingService.findByDepartureLocation(departureLocation);
    }
    if (arrivalLocation) {
      return this.codrivingService.findByArrivalLocation(arrivalLocation);
    }
    if (minSeats) {
      return this.codrivingService.findAvailableSeats(parseInt(minSeats));
    }
    if (minPrice && maxPrice) {
      return this.codrivingService.findByPriceRange(
        parseFloat(minPrice),
        parseFloat(maxPrice),
      );
    }
    return this.codrivingService.findAll();
  }
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Codriving> {
    const codriving = await this.codrivingService.findById(id);
    if (!codriving) {
      throw new NotFoundException(`Codriving with ID ${id} not found`);
    }
    return codriving;
  }
  @Post()
  async create(
    @Body() createCodrivingDto: CreateCodrivingDto,
  ): Promise<Codriving> {
    return this.codrivingService.create(createCodrivingDto);
  }
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCodrivingDto: UpdateCodrivingDto,
  ): Promise<Codriving> {
    const codriving = await this.codrivingService.update(
      id,
      updateCodrivingDto,
    );
    if (!codriving) {
      throw new NotFoundException(`Codriving with ID ${id} not found`);
    }
    return codriving;
  }
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const deleted = await this.codrivingService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Codriving with ID ${id} not found`);
    }
    return { message: 'Codriving deleted successfully' };
  }
}
