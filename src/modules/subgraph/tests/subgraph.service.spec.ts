import { Test, TestingModule } from '@nestjs/testing';
import { SubgraphService } from '../services/subgraph.service';
import { request, gql } from 'graphql-request';

jest.mock('graphql-request', () => ({
  request: jest.fn(),
  gql: jest.fn((query: TemplateStringsArray) => query.join('')),
}));

describe('SubgraphService', () => {
  let service: SubgraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubgraphService],
    }).compile();

    service = module.get<SubgraphService>(SubgraphService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserTransactions', () => {
    it('should fetch user transactions successfully', async () => {
      const mockResponse = {
        userTransactions: [
          {
            id: '1',
            eventType: 'Earn',
            points: 100,
            tokens: 10,
            timestamp: '2025-01-01T00:00:00Z',
          },
        ],
      };

      const userAddress = '0x1234567890abcdef1234567890abcdef12345678';
      (request as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getUserTransactions(userAddress);

      expect(request).toHaveBeenCalledWith(
        service['endpoint'],
        expect.any(String),
        { user: userAddress.toLowerCase() },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the request fails', async () => {
      const userAddress = '0x1234567890abcdef1234567890abcdef12345678';
      (request as jest.Mock).mockRejectedValue(
        new Error('GraphQL request failed'),
      );

      await expect(service.getUserTransactions(userAddress)).rejects.toThrow(
        'GraphQL request failed',
      );

      expect(request).toHaveBeenCalledWith(
        service['endpoint'],
        expect.any(String),
        { user: userAddress.toLowerCase() },
      );
    });
  });
});
