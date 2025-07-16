import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { UsersService } from '../../database/users/users.service';
import { CarsService } from '../../database/cars/cars.service';
import { CodrivingService } from '../../database/codriving/codriving.service';
const mockUsersService = {
  findAll: jest.fn(),
};
const mockCarsService = {
  findAll: jest.fn(),
};
const mockCodrivingService = {
  findAll: jest.fn(),
};
describe('SearchService', () => {
  let service: SearchService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CarsService,
          useValue: mockCarsService,
        },
        {
          provide: CodrivingService,
          useValue: mockCodrivingService,
        },
      ],
    }).compile();
    service = module.get<SearchService>(SearchService);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('searchAll', () => {
    it('should search across all entity types', async () => {
      const mockUsers = [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          pseudo: 'johndoe',
          mail: 'john@example.com',
        },
      ];
      const mockCars = [
        {
          id: 1,
          model: 'Tesla Model 3',
          immatriculation: 'TE-123-SL',
          energy: 'Electric',
          color: 'White',
        },
      ];
      const mockCodriving = [
        {
          id: 1,
          departureLocation: 'Paris',
          arrivalLocation: 'Lyon',
          statut: 'active',
          seatsAvailable: 3,
          price: 25.5,
        },
      ];
      mockUsersService.findAll.mockResolvedValue(mockUsers);
      mockCarsService.findAll.mockResolvedValue(mockCars);
      mockCodrivingService.findAll.mockResolvedValue(mockCodriving);
      const result = await service.searchAll('tesla');
      expect(result).toHaveLength(1);
      expect(result.some((r) => r.type === 'car')).toBe(true);
    });
  });
  describe('searchByType', () => {
    it('should filter results by type', async () => {
      const mockUsers = [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          pseudo: 'johndoe',
          mail: 'john@example.com',
        },
      ];
      mockUsersService.findAll.mockResolvedValue(mockUsers);
      mockCarsService.findAll.mockResolvedValue([]);
      mockCodrivingService.findAll.mockResolvedValue([]);
      const result = await service.searchByType('john', 'user');
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('user');
      expect(result[0].title).toContain('John Doe');
    });
  });
});
