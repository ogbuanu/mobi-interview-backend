import { Test, TestingModule } from '@nestjs/testing';
import { SubgraphController } from '../controllers/subgraph.controller';
import { SubgraphService } from '../services/subgraph.service';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';

describe('SubgraphController', () => {
  let controller: SubgraphController;
  let service: SubgraphService;

  const mockSubgraphService = {
    getUserTransactions: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubgraphController],
      providers: [
        {
          provide: SubgraphService,
          useValue: mockSubgraphService,
        },
      ],
    }).compile();

    controller = module.get<SubgraphController>(SubgraphController);
    service = module.get<SubgraphService>(SubgraphService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserTransactions', () => {
    it('should return transactions successfully', async () => {
      const userAddress = '0x123';
      const transactions = [
        {
          id: 'txn1',
          eventType: 'redeem',
          points: 100,
          tokens: 50,
          timestamp: '2025-01-20T12:34:56Z',
        },
      ];

      mockSubgraphService.getUserTransactions.mockResolvedValueOnce(
        transactions,
      );

      await controller.getUserTransactions(mockResponse, userAddress);

      expect(mockSubgraphService.getUserTransactions).toHaveBeenCalledWith(
        userAddress,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(transactions);
    });

    it('should throw an HttpException on error', async () => {
      const userAddress = '0x123';
      const errorMessage = 'GraphQL query failed';

      mockSubgraphService.getUserTransactions.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        controller.getUserTransactions(mockResponse, userAddress),
      ).rejects.toThrow(HttpException);

      expect(mockSubgraphService.getUserTransactions).toHaveBeenCalledWith(
        userAddress,
      );
    });
  });
});
