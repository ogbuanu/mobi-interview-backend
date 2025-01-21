import { Test, TestingModule } from '@nestjs/testing';
import { RewardsService } from '../services/reward.service';
import { ethers } from 'ethers';

jest.mock('ethers');

describe('RewardsService', () => {
  let service: RewardsService;

  const mockProvider = {
    getNetwork: jest.fn(),
  };

  const mockSigner = {
    connect: jest.fn(),
  };

  const mockContract = {
    checkBalance: jest.fn(),
    redeemPoints: jest.fn(),
    earn: jest.fn(),
    connect: jest.fn(),
  };
  mockContract.connect = jest.fn().mockReturnValue(mockContract);

  beforeEach(async () => {
    (ethers.JsonRpcProvider as jest.Mock).mockImplementation(
      () => mockProvider,
    );
    (ethers.Wallet as any as jest.Mock).mockImplementation(() => mockSigner);
    (ethers.Contract as jest.Mock).mockImplementation(() => mockContract);

    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardsService],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserBalance', () => {
    it('should return the user balance as a number', async () => {
      mockContract.checkBalance.mockResolvedValue('1000');

      const userAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const result = await service.getUserBalance(userAddress);

      expect(mockContract.checkBalance).toHaveBeenCalledWith(userAddress);
      expect(result).toBe(1000);
    });

    it('should throw an error if checkBalance fails', async () => {
      mockContract.checkBalance.mockRejectedValue(
        new Error('Contract call failed'),
      );

      const userAddress = '0x1234567890abcdef1234567890abcdef12345678';

      await expect(service.getUserBalance(userAddress)).rejects.toThrow(
        'Contract call failed',
      );

      expect(mockContract.checkBalance).toHaveBeenCalledWith(userAddress);
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points for a user', async () => {
      const mockTx = {
        wait: jest.fn().mockResolvedValue(true),
      };
      mockContract.redeemPoints.mockResolvedValue(mockTx);

      const userAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const points = 50;

      await service.redeemPoints(userAddress, points);

      expect(mockContract.redeemPoints).toHaveBeenCalledWith(
        userAddress,
        points,
      );
      expect(mockTx.wait).toHaveBeenCalled();
    });

    it('should throw an error if redeemPoints fails', async () => {
      mockContract.redeemPoints.mockRejectedValue(
        new Error('Transaction failed'),
      );

      const userAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const points = 50;

      await expect(service.redeemPoints(userAddress, points)).rejects.toThrow(
        'Transaction failed',
      );

      expect(mockContract.redeemPoints).toHaveBeenCalledWith(
        userAddress,
        points,
      );
    });
  });

  describe('earnPoints', () => {
    it('should earn points for a user', async () => {
      const mockTx = {
        wait: jest.fn().mockResolvedValue(true),
      };
      mockContract.earn.mockResolvedValue(mockTx);

      const userAddress = '0x1234567890abcdef1234567890abcdef12345678';

      await service.earnPoints(userAddress);

      expect(mockContract.earn).toHaveBeenCalledWith(userAddress);
      expect(mockTx.wait).toHaveBeenCalled();
    });

    it('should throw an error if earn fails', async () => {
      mockContract.earn.mockRejectedValue(new Error('Transaction failed'));

      const userAddress = '0x1234567890abcdef1234567890abcdef12345678';

      await expect(service.earnPoints(userAddress)).rejects.toThrow(
        'Transaction failed',
      );

      expect(mockContract.earn).toHaveBeenCalledWith(userAddress);
    });
  });
});
