import { Test, TestingModule } from '@nestjs/testing';
import { TokenController } from '../controllers/token.controller';
import { TokenService } from '../services/token.service';
import { Response } from 'express';

describe('TokenController', () => {
  let controller: TokenController;
  let tokenService: TokenService;

  const mockTokenService = {
    fetchTokenPrice: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [{ provide: TokenService, useValue: mockTokenService }],
    }).compile();

    controller = module.get<TokenController>(TokenController);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPrice', () => {
    it('should return the token price successfully', async () => {
      const mockPrice = 12345.67;
      mockTokenService.fetchTokenPrice.mockResolvedValue(mockPrice);

      await controller.getPrice(mockResponse);

      expect(mockTokenService.fetchTokenPrice).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: { name: 'Bitcoin', price: mockPrice },
      });
    });

    it('should handle errors and throw an HttpException', async () => {
      const mockError = new Error('Failed to fetch token price');
      mockTokenService.fetchTokenPrice.mockRejectedValue(mockError);

      await expect(controller.getPrice(mockResponse)).rejects.toThrow(
        'Failed to fetch token price',
      );

      expect(mockTokenService.fetchTokenPrice).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
