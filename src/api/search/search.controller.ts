import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchService, SearchResult } from './search.service';
import { TripSearchService } from './trip-search.service';
import { TripSearchDto, TripSearchResultDto } from './dto/trip-search.dto';
@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly tripSearchService: TripSearchService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'Search across all entities' })
  @ApiQuery({ name: 'q', description: 'Search query string' })
  @ApiResponse({
    status: 200,
    description: 'Return search results from all entities.',
    type: [SearchResult],
  })
  async searchAll(@Query('q') query: string): Promise<SearchResult[]> {
    if (!query || query.trim() === '') {
      return [];
    }
    return this.searchService.searchAll(query.trim());
  }
  @Get('users')
  @ApiOperation({ summary: 'Search users only' })
  @ApiQuery({ name: 'q', description: 'Search query string' })
  @ApiResponse({
    status: 200,
    description: 'Return search results from users.',
    type: [SearchResult],
  })
  async searchUsers(@Query('q') query: string): Promise<SearchResult[]> {
    if (!query || query.trim() === '') {
      return [];
    }
    return this.searchService.searchByType(query.trim(), 'user');
  }
  @Get('cars')
  @ApiOperation({ summary: 'Search cars only' })
  @ApiQuery({ name: 'q', description: 'Search query string' })
  @ApiResponse({
    status: 200,
    description: 'Return search results from cars.',
    type: [SearchResult],
  })
  async searchCars(@Query('q') query: string): Promise<SearchResult[]> {
    if (!query || query.trim() === '') {
      return [];
    }
    return this.searchService.searchByType(query.trim(), 'car');
  }
  @Get('codriving')
  @ApiOperation({ summary: 'Search codriving rides only' })
  @ApiQuery({ name: 'q', description: 'Search query string' })
  @ApiResponse({
    status: 200,
    description: 'Return search results from codriving rides.',
    type: [SearchResult],
  })
  async searchCodriving(@Query('q') query: string): Promise<SearchResult[]> {
    if (!query || query.trim() === '') {
      return [];
    }
    return this.searchService.searchByType(query.trim(), 'codriving');
  }
  @Get('trips')
  @ApiOperation({ summary: 'Search trips with advanced filtering' })
  @ApiResponse({
    status: 200,
    description: 'Trip search results returned successfully',
    type: [TripSearchResultDto],
  })
  async searchTrips(
    @Query() searchParams: TripSearchDto,
  ): Promise<TripSearchResultDto[]> {
    return this.tripSearchService.searchTrips(searchParams);
  }
  @Get('trips/available')
  @ApiOperation({ summary: 'Search only available trips' })
  @ApiResponse({
    status: 200,
    description: 'Available trip search results returned successfully',
    type: [TripSearchResultDto],
  })
  async searchAvailableTrips(
    @Query() searchParams: TripSearchDto,
  ): Promise<TripSearchResultDto[]> {
    const params = { ...searchParams, status: 'SCHEDULED' };
    return this.tripSearchService.searchTrips(params);
  }
  @Get('trips/ecological')
  @ApiOperation({ summary: 'Search ecological trips only' })
  @ApiResponse({
    status: 200,
    description: 'Ecological trip search results returned successfully',
    type: [TripSearchResultDto],
  })
  async searchEcologicalTrips(
    @Query() searchParams: TripSearchDto,
  ): Promise<TripSearchResultDto[]> {
    const params = { ...searchParams, onlyEcological: true };
    return this.tripSearchService.searchTrips(params);
  }
}
