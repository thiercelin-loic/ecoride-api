import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Codriving,
  TripStatus,
} from '../../database/codriving/codriving.entity';
import { TripSearchDto, TripSearchResultDto } from './dto/trip-search.dto';

@Injectable()
export class TripSearchService {
  constructor(
    @Inject('CODRIVING_REPOSITORY')
    private codrivingRepository: Repository<Codriving>,
  ) {}

  async searchTrips(searchDto: TripSearchDto): Promise<TripSearchResultDto[]> {
    const queryBuilder = this.codrivingRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.car', 'car')
      .leftJoinAndSelect('car.brand', 'brand')
      .where('trip.status = :status', { status: TripStatus.AVAILABLE })
      .andWhere('trip.departureCity LIKE :departureCity', {
        departureCity: `%${searchDto.departureCity}%`,
      })
      .andWhere('trip.arrivalCity LIKE :arrivalCity', {
        arrivalCity: `%${searchDto.arrivalCity}%`,
      })
      .andWhere('trip.departureDate = :departureDate', {
        departureDate: searchDto.departureDate,
      })
      .andWhere('trip.seatsAvailable > 0');

    if (searchDto.maxPrice) {
      queryBuilder.andWhere('trip.price <= :maxPrice', {
        maxPrice: searchDto.maxPrice,
      });
    }

    if (searchDto.maxDuration) {
      queryBuilder.andWhere('trip.durationMinutes <= :maxDuration', {
        maxDuration: searchDto.maxDuration,
      });
    }

    if (searchDto.ecologicalOnly) {
      queryBuilder.andWhere('car.energy = :energy', { energy: 'Electric' });
    }

    if (searchDto.minSeats) {
      queryBuilder.andWhere('trip.seatsAvailable >= :minSeats', {
        minSeats: searchDto.minSeats,
      });
    }

    queryBuilder
      .orderBy('trip.departureDate', 'ASC')
      .addOrderBy('trip.departureHour', 'ASC');

    const trips = await queryBuilder.getMany();

    return trips.map((trip) => this.mapTripToSearchResult(trip));
  }

  async findAlternativeTrips(
    departureCity: string,
    arrivalCity: string,
    requestedDate: string,
  ): Promise<TripSearchResultDto[]> {
    const requestedDateObj = new Date(requestedDate);
    const dayAfter = new Date(requestedDateObj);
    dayAfter.setDate(dayAfter.getDate() + 1);
    const dayBefore = new Date(requestedDateObj);
    dayBefore.setDate(dayBefore.getDate() - 1);

    const alternatives = await this.codrivingRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.car', 'car')
      .where('trip.status = :status', { status: TripStatus.AVAILABLE })
      .andWhere('trip.departureCity LIKE :departureCity', {
        departureCity: `%${departureCity}%`,
      })
      .andWhere('trip.arrivalCity LIKE :arrivalCity', {
        arrivalCity: `%${arrivalCity}%`,
      })
      .andWhere('trip.seatsAvailable > 0')
      .andWhere(
        '(trip.departureDate = :dayBefore OR trip.departureDate = :dayAfter)',
        {
          dayBefore: dayBefore.toISOString().split('T')[0],
          dayAfter: dayAfter.toISOString().split('T')[0],
        },
      )
      .orderBy('trip.departureDate', 'ASC')
      .limit(5)
      .getMany();

    return alternatives.map((trip) => this.mapTripToSearchResult(trip));
  }

  async getTripDetails(tripId: number): Promise<TripSearchResultDto | null> {
    const trip = await this.codrivingRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.car', 'car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('trip.bookings', 'bookings')
      .where('trip.id = :id', { id: tripId })
      .getOne();

    if (!trip) {
      return null;
    }

    return this.mapTripToSearchResult(trip);
  }

  private mapTripToSearchResult(trip: Codriving): TripSearchResultDto {
    const departureDateTime = new Date(trip.departureDate);
    const [depHours, depMinutes] = trip.departureHour.split(':');
    departureDateTime.setHours(parseInt(depHours), parseInt(depMinutes));

    const arrivalDateTime = new Date(trip.arrivalDate);
    const [arrHours, arrMinutes] = trip.arrivalHour.split(':');
    arrivalDateTime.setHours(parseInt(arrHours), parseInt(arrMinutes));

    return {
      id: trip.id,
      departureCity: trip.departureCity,
      arrivalCity: trip.arrivalCity,
      departureDateTime,
      arrivalDateTime,
      price: parseFloat(trip.price.toString()),
      seatsAvailable: trip.seatsAvailable,
      isEcological: trip.car?.energy === 'Electric',
      durationMinutes:
        trip.durationMinutes ||
        this.calculateDuration(departureDateTime, arrivalDateTime),
      driver: {
        id: trip.driver?.id,
        pseudo: trip.driver?.pseudo,
        picture_profil: trip.driver?.picture_profil,
        rating: 4.5,
      },
      car: {
        id: trip.car?.id,
        model: trip.car?.model,
        energy: trip.car?.energy,
        color: trip.car?.color,
      },
    };
  }

  private calculateDuration(departure: Date, arrival: Date): number {
    return Math.abs(arrival.getTime() - departure.getTime()) / (1000 * 60);
  }
}
