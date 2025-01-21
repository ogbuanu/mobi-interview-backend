import { Test, TestingModule } from '@nestjs/testing';
import { RewardController } from '../controllers/reward.controller';
import { RewardsService } from '../services/reward.service';
import { HttpException } from '@nestjs/common';
import { Response } from 'express';

// Mock the Response object
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock RewardsService
const mockRewardsService = {
  getUserBalance: jest.fn(),
  redeemPoints: jest.fn(),
  earnPoints: jest.fn(),
};

describe('RewardController', () => {
  let controller: RewardController;
  let service: RewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardController],
      providers: [
        {
          provide: RewardsService,
          useValue: mockRewardsService,
        },
      ],
    }).compile();

    controller = module.get<RewardController>(RewardController);
    service = module.get<RewardsService>(RewardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserBalance', () => {
    it('should return balance on success', async () => {
      const res = mockResponse();
      const userAddress = '0x123';
      const balance = 100;

      mockRewardsService.getUserBalance.mockResolvedValueOnce(balance);

      await controller.getUserBalance(res, userAddress);

      expect(service.getUserBalance).toHaveBeenCalledWith(userAddress);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Balance fetched successfully',
        balance,
      });
    });

    it('should throw an HttpException on error', async () => {
      const res = mockResponse();
      const userAddress = '0x123';
      mockRewardsService.getUserBalance.mockRejectedValueOnce(
        new Error('Balance fetch failed'),
      );

      await expect(controller.getUserBalance(res, userAddress)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points successfully', async () => {
      const res = mockResponse();
      const userAddress = '0x123';
      const points = 50;

      mockRewardsService.redeemPoints.mockResolvedValueOnce(undefined);

      await controller.redeemPoints(res, userAddress, points);

      expect(service.redeemPoints).toHaveBeenCalledWith(userAddress, points);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Points redeemed successfully',
      });
    });

    it('should throw an HttpException on error', async () => {
      const res = mockResponse();
      const userAddress = '0x123';
      const points = 50;

      mockRewardsService.redeemPoints.mockRejectedValueOnce(
        new Error('Redemption failed'),
      );

      await expect(
        controller.redeemPoints(res, userAddress, points),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('earnPoints', () => {
    it('should earn points successfully', async () => {
      const res = mockResponse();
      const userAddress = '0x123';

      mockRewardsService.earnPoints.mockResolvedValueOnce(undefined);

      await controller.earnPoints(res, userAddress);

      expect(service.earnPoints).toHaveBeenCalledWith(userAddress);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Points earned successfully',
      });
    });

    it('should throw an HttpException on error', async () => {
      const res = mockResponse();
      const userAddress = '0x123';

      mockRewardsService.earnPoints.mockRejectedValueOnce(
        new Error('Earning points failed'),
      );

      await expect(controller.earnPoints(res, userAddress)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
