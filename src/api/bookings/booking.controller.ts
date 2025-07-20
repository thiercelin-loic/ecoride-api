import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { BookingService } from '../../database/bookings/booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { Booking } from '../../database/bookings/booking.entity';
import { AuthenticatedRequest } from '../../types/auth.types';
@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Booking created successfully',
    type: Booking,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or insufficient credits',
  })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking> {
    return this.bookingService.create(createBookingDto, req.user.id);
  }
  @Get()
  @ApiOperation({ summary: 'Get all bookings for authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bookings retrieved successfully',
    type: [Booking],
  })
  async findAllForUser(
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking[]> {
    return this.bookingService.findAllForUser(req.user.id);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking retrieved successfully',
    type: Booking,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking> {
    return this.bookingService.findOne(id, req.user.id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking updated successfully',
    type: Booking,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking> {
    return this.bookingService.update(id, updateBookingDto, req.user.id);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking cancelled successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.bookingService.cancel(id, req.user.id);
  }
  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm a booking (driver only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking confirmed successfully',
    type: Booking,
  })
  async confirm(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking> {
    return this.bookingService.confirm(id, req.user.id);
  }
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark booking as completed (driver only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking marked as completed successfully',
    type: Booking,
  })
  async complete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking> {
    return this.bookingService.complete(id, req.user.id);
  }
}
