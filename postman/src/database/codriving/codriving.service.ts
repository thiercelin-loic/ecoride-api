import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Codriving, TripStatus } from './codriving.entity';
export interface CreateCodrivingDto {
  departureDate: Date;
  departureHour: string;
  departureLocation: string;
  departureCity: string;
  arrivalDate: Date;
  arrivalHour: string;
  arrivalLocation: string;
  arrivalCity: string;
  status: TripStatus;
  seatsAvailable: number;
  price: number;
  durationMinutes?: number;
  driverId: number;
  carId?: number;
}
export interface UpdateCodrivingDto {
  departureDate?: Date;
  departureHour?: string;
  departureLocation?: string;
  departureCity?: string;
  arrivalDate?: Date;
  arrivalHour?: string;
  arrivalLocation?: string;
  arrivalCity?: string;
  status?: TripStatus;
  seatsAvailable?: number;
  price?: number;
  durationMinutes?: number;
  driverId?: number;
  carId?: number;
}
@Injectable()
export class CodrivingService {
  constructor(
    @Inject('CODRIVING_REPOSITORY')
    private codrivingRepository: Repository<Codriving>,
  ) {}
  async findAll(): Promise<Codriving[]> {
    return this.codrivingRepository.find();
  }
  async findById(id: number): Promise<Codriving | null> {
    return this.codrivingRepository.findOne({ where: { id } });
  }
  async findOne(id: number): Promise<Codriving | null> {
    return this.codrivingRepository.findOne({
      where: { id },
      relations: ['driver', 'car', 'car.brand'],
    });
  }
  async findByStatus(status: TripStatus): Promise<Codriving[]> {
    return this.codrivingRepository.find({ where: { status } });
  }
  async findByDepartureLocation(
    departureLocation: string,
  ): Promise<Codriving[]> {
    return this.codrivingRepository.find({ where: { departureLocation } });
  }
  async findByArrivalLocation(arrivalLocation: string): Promise<Codriving[]> {
    return this.codrivingRepository.find({ where: { arrivalLocation } });
  }
  async findAvailableSeats(minSeats: number): Promise<Codriving[]> {
    return this.codrivingRepository
      .createQueryBuilder('codriving')
      .where('codriving.seatsAvailable >= :minSeats', { minSeats })
      .getMany();
  }
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Codriving[]> {
    return this.codrivingRepository
      .createQueryBuilder('codriving')
      .where('codriving.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      })
      .getMany();
  }
  async create(createCodrivingDto: CreateCodrivingDto): Promise<Codriving> {
    const codriving = this.codrivingRepository.create(createCodrivingDto);
    return this.codrivingRepository.save(codriving);
  }
  async update(
    id: number,
    updateCodrivingDto: UpdateCodrivingDto,
  ): Promise<Codriving | null> {
    await this.codrivingRepository.update(id, updateCodrivingDto);
    return this.findById(id);
  }
  async updateSeats(
    id: number,
    seatsAvailable: number,
  ): Promise<Codriving | null> {
    await this.codrivingRepository.update(id, { seatsAvailable });
    return this.findById(id);
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.codrivingRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
