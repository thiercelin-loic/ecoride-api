import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Car } from './cars.entity';
export interface CreateCarDto {
  model: string;
  immatriculation: string;
  energy: 'Electric' | 'Hybrid' | 'Gasoline' | 'Diesel';
  color: string;
  dateOfRelease: Date;
}
export interface UpdateCarDto {
  model?: string;
  immatriculation?: string;
  energy?: 'Electric' | 'Hybrid' | 'Gasoline' | 'Diesel';
  color?: string;
  dateOfRelease?: Date;
}
@Injectable()
export class CarsService {
  constructor(
    @Inject('CARS_REPOSITORY')
    private carsRepository: Repository<Car>,
  ) {}
  async findAll(): Promise<Car[]> {
    return this.carsRepository.find();
  }
  async findById(id: number): Promise<Car | null> {
    return this.carsRepository.findOne({ where: { id: id.toString() } });
  }
  async findByImmatriculation(immatriculation: string): Promise<Car | null> {
    return this.carsRepository
      .createQueryBuilder('car')
      .where('car.immatriculation = :immatriculation', { immatriculation })
      .getOne();
  }
  async findByModel(model: string): Promise<Car[]> {
    return this.carsRepository.find({ where: { model } });
  }
  async findByEnergy(
    energy: 'Electric' | 'Hybrid' | 'Gasoline' | 'Diesel',
  ): Promise<Car[]> {
    return this.carsRepository.find({ where: { energy } });
  }
  async findByColor(color: string): Promise<Car[]> {
    return this.carsRepository.find({ where: { color } });
  }
  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = this.carsRepository.create(createCarDto);
    return this.carsRepository.save(car);
  }
  async update(id: number, updateCarDto: UpdateCarDto): Promise<Car | null> {
    await this.carsRepository.update(id, updateCarDto);
    return this.findById(id);
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.carsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
