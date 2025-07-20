import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { UsersService } from '../users/users.service';
import { CodrivingService } from '../codriving/codriving.service';
export interface CreateBookingRequest {
  codrivingId: number;
  creditsUsed: number;
  notes?: string;
}
export interface UpdateBookingRequest {
  status?: BookingStatus;
  notes?: string;
}
@Injectable()
export class BookingService {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository: Repository<Booking>,
    private usersService: UsersService,
    private codrivingService: CodrivingService,
  ) {}
  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['passenger', 'codriving'],
    });
  }
  async findOne(id: number, userId?: number): Promise<Booking> {
    const where: { id: number; passengerId?: number } = { id };
    if (userId) {
      where.passengerId = userId;
    }
    const booking = await this.bookingRepository.findOne({
      where,
      relations: ['passenger', 'codriving'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }
  async findAllForUser(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { passengerId: userId },
      relations: ['passenger', 'codriving'],
    });
  }
  async findByPassenger(passengerId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { passengerId },
      relations: ['passenger', 'codriving'],
    });
  }
  async findByCodriving(codrivingId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { codrivingId },
      relations: ['passenger', 'codriving'],
    });
  }
  async create(
    createBookingDto: CreateBookingRequest,
    userId: number,
  ): Promise<Booking> {
    const passenger = await this.usersService.findOne(userId);
    if (!passenger) {
      throw new BadRequestException('Passenger not found');
    }
    if (passenger.credits < createBookingDto.creditsUsed) {
      throw new BadRequestException('Insufficient credits');
    }
    const codriving = await this.codrivingService.findOne(
      createBookingDto.codrivingId,
    );
    if (!codriving) {
      throw new BadRequestException('Trip not found');
    }
    if (codriving.seatsAvailable <= 0) {
      throw new BadRequestException('No seats available');
    }
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        passengerId: userId,
        codrivingId: createBookingDto.codrivingId,
        status: BookingStatus.CONFIRMED,
      },
    });
    if (existingBooking) {
      throw new BadRequestException('Already booked this trip');
    }
    const booking = this.bookingRepository.create({
      passengerId: userId,
      codrivingId: createBookingDto.codrivingId,
      creditsUsed: createBookingDto.creditsUsed,
      notes: createBookingDto.notes,
      status: BookingStatus.PENDING,
    });
    const savedBooking = await this.bookingRepository.save(booking);
    await this.usersService.updateCredits(
      userId,
      passenger.credits - createBookingDto.creditsUsed,
    );
    await this.codrivingService.updateSeats(
      createBookingDto.codrivingId,
      codriving.seatsAvailable - 1,
    );
    return savedBooking;
  }
  async update(
    id: number,
    updateBookingDto: UpdateBookingRequest,
    userId: number,
  ): Promise<Booking> {
    await this.findOne(id, userId);
    await this.bookingRepository.update(id, updateBookingDto);
    return this.findOne(id, userId);
  }
  async cancel(id: number, userId: number): Promise<void> {
    const booking = await this.findOne(id, userId);
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking already cancelled');
    }
    await this.bookingRepository.update(id, {
      status: BookingStatus.CANCELLED,
    });
    const passenger = await this.usersService.findOne(booking.passengerId);
    if (passenger) {
      await this.usersService.updateCredits(
        booking.passengerId,
        passenger.credits + booking.creditsUsed,
      );
    }
    const codriving = await this.codrivingService.findOne(booking.codrivingId);
    if (codriving) {
      await this.codrivingService.updateSeats(
        booking.codrivingId,
        codriving.seatsAvailable + 1,
      );
    }
  }
  async confirm(id: number, driverId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['codriving', 'codriving.driver'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.codriving.driver.id !== driverId) {
      throw new BadRequestException('Only the driver can confirm bookings');
    }
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }
    await this.bookingRepository.update(id, {
      status: BookingStatus.CONFIRMED,
    });
    return this.findOne(id);
  }
  async complete(id: number, driverId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['codriving', 'codriving.driver'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.codriving.driver.id !== driverId) {
      throw new BadRequestException('Only the driver can complete bookings');
    }
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be completed');
    }
    await this.bookingRepository.update(id, {
      status: BookingStatus.COMPLETED,
    });
    return this.findOne(id);
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.bookingRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
