import { Injectable } from '@nestjs/common';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UsersService } from '../../database/users/users.service';
import { CarsService } from '../../database/cars/cars.service';
import { CodrivingService } from '../../database/codriving/codriving.service';
import { User } from '../../database/users/users.entity';
import { Car } from '../../database/cars/cars.entity';
import { Codriving } from '../../database/codriving/codriving.entity';
export class SearchResult {
  @ApiProperty({
    description: 'Type of the search result',
    enum: ['user', 'car', 'codriving'],
  })
  type: 'user' | 'car' | 'codriving';
  @ApiProperty({ description: 'ID of the found entity' })
  id: number;
  @ApiProperty({ description: 'Title/name of the found entity' })
  title: string;
  @ApiPropertyOptional({
    description: 'Additional description of the found entity',
  })
  description?: string;
  @ApiProperty({ description: 'Complete data of the found entity' })
  data: User | Car | Codriving;
}
@Injectable()
export class SearchService {
  constructor(
    private readonly usersService: UsersService,
    private readonly carsService: CarsService,
    private readonly codrivingService: CodrivingService,
  ) {}
  async searchAll(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const users = await this.usersService.findAll();
    const matchingUsers = users.filter(
      (user) =>
        user.pseudo?.toLowerCase().includes(query.toLowerCase()) ||
        user.firstname?.toLowerCase().includes(query.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(query.toLowerCase()),
    );
    matchingUsers.forEach((user) => {
      results.push({
        type: 'user',
        id: user.id,
        title: `${user.firstname} ${user.lastname} (${user.pseudo})`,
        description: user.mail,
        data: user,
      });
    });
    const cars = await this.carsService.findAll();
    const matchingCars = cars.filter(
      (car) =>
        car.model?.toLowerCase().includes(query.toLowerCase()) ||
        car.licensePlate?.toLowerCase().includes(query.toLowerCase()) ||
        (typeof car['energy'] === 'string' &&
          car['energy'].toLowerCase().includes(query.toLowerCase())),
    );
    matchingCars.forEach((car) => {
      results.push({
        type: 'car',
        id: Number(car.id),
        title: `${car.model} (${car.licensePlate})`,
        description: `${car.energy} - ${car.color}`,
        data: car,
      });
    });
    const codriving = await this.codrivingService.findAll();
    const matchingCodriving = codriving.filter(
      (trip) =>
        trip.departureLocation?.toLowerCase().includes(query.toLowerCase()) ||
        trip.arrivalLocation?.toLowerCase().includes(query.toLowerCase()) ||
        trip.status?.toLowerCase().includes(query.toLowerCase()),
    );
    matchingCodriving.forEach((trip) => {
      results.push({
        type: 'codriving',
        id: trip.id,
        title: `${trip.departureLocation} → ${trip.arrivalLocation}`,
        description: `${trip.status} - ${trip.seatsAvailable} seats - €${trip.price}`,
        data: trip,
      });
    });
    return results;
  }
  async searchByType(
    query: string,
    type: 'user' | 'car' | 'codriving',
  ): Promise<SearchResult[]> {
    const allResults = await this.searchAll(query);
    return allResults.filter((result) => result.type === type);
  }
}
