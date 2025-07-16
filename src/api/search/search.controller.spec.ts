import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
const mockSearchService = {
  searchAll: jest.fn(),
  searchByType: jest.fn(),
};
describe('SearchController', () => {
  let controller: SearchController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();
    controller = module.get<SearchController>(SearchController);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('searchAll', () => {
    it('should return search results for all types', async () => {
      const mockResults = [
        { type: 'user', id: 1, title: 'John Doe', data: {} },
        { type: 'car', id: 1, title: 'Tesla Model 3', data: {} },
      ];
      mockSearchService.searchAll.mockResolvedValue(mockResults);
      const result = await controller.searchAll('test');
      expect(result).toEqual(mockResults);
      expect(mockSearchService.searchAll).toHaveBeenCalledWith('test');
    });
    it('should return empty array for empty query', async () => {
      const result = await controller.searchAll('');
      expect(result).toEqual([]);
      expect(mockSearchService.searchAll).not.toHaveBeenCalled();
    });
  });
  describe('searchUsers', () => {
    it('should return user search results only', async () => {
      const mockResults = [
        { type: 'user', id: 1, title: 'John Doe', data: {} },
      ];
      mockSearchService.searchByType.mockResolvedValue(mockResults);
      const result = await controller.searchUsers('john');
      expect(result).toEqual(mockResults);
      expect(mockSearchService.searchByType).toHaveBeenCalledWith(
        'john',
        'user',
      );
    });
  });
});
